import { initializeApp } from 'firebase-admin/app'
import { getAuth } from 'firebase-admin/auth'
import { FieldValue, getFirestore } from 'firebase-admin/firestore'
import { HttpsError, onCall, type CallableRequest } from 'firebase-functions/v2/https'
import { onDocumentCreated } from 'firebase-functions/v2/firestore'
import * as logger from 'firebase-functions/logger'

initializeApp()

const db = getFirestore()
const auth = getAuth()
const REGION = 'us-central1'

const ROLES = ['administrador', 'editor', 'publico'] as const
type Role = (typeof ROLES)[number]

function isRole(value: unknown): value is Role {
  return typeof value === 'string' && (ROLES as readonly string[]).includes(value)
}

async function assertAdmin(request: CallableRequest): Promise<string> {
  if (!request.auth) {
    throw new HttpsError('unauthenticated', 'Debes iniciar sesión.')
  }
  const snapshot = await db.doc(`users/${request.auth.uid}`).get()
  if (!snapshot.exists || snapshot.get('rol') !== 'administrador') {
    throw new HttpsError('permission-denied', 'Se requiere el rol de administrador.')
  }
  return request.auth.uid
}

/**
 * Cambia el rol de un usuario en Firestore y en sus custom claims.
 * Un administrador no puede quitarse a sí mismo el rol.
 */
export const setUserRole = onCall({ region: REGION }, async (request) => {
  const callerUid = await assertAdmin(request)
  const { uid, rol } = (request.data ?? {}) as { uid?: unknown; rol?: unknown }

  if (typeof uid !== 'string' || !isRole(rol)) {
    throw new HttpsError('invalid-argument', 'Usuario o rol inválido.')
  }
  if (uid === callerUid && rol !== 'administrador') {
    throw new HttpsError(
      'failed-precondition',
      'No puedes quitarte tu propio rol de administrador.',
    )
  }

  try {
    await auth.getUser(uid)
  } catch {
    throw new HttpsError('not-found', 'El usuario no existe en Authentication.')
  }

  await auth.setCustomUserClaims(uid, { rol })
  await db.doc(`users/${uid}`).set(
    { rol, fechaActualizacion: FieldValue.serverTimestamp() },
    { merge: true },
  )

  logger.info('Rol actualizado', { uid, rol, by: callerUid })
  return { ok: true, uid, rol }
})

/**
 * Crea una cuenta de equipo con contraseña temporal y perfil con rol.
 * Solo puede invocarlo un administrador autenticado.
 */
export const createStaffUser = onCall({ region: REGION }, async (request) => {
  const callerUid = await assertAdmin(request)
  const { email, password, nombre, rol } = (request.data ?? {}) as {
    email?: unknown
    password?: unknown
    nombre?: unknown
    rol?: unknown
  }

  if (typeof email !== 'string' || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    throw new HttpsError('invalid-argument', 'Correo inválido.')
  }
  if (typeof password !== 'string' || password.length < 8) {
    throw new HttpsError('invalid-argument', 'La contraseña debe tener al menos 8 caracteres.')
  }
  if (typeof nombre !== 'string' || nombre.trim().length < 2) {
    throw new HttpsError('invalid-argument', 'Escribe el nombre de la persona.')
  }
  if (!isRole(rol) || rol === 'publico') {
    throw new HttpsError('invalid-argument', 'Rol inválido para una cuenta de equipo.')
  }

  const normalizedEmail = email.trim().toLowerCase()

  try {
    const existing = await auth.getUserByEmail(normalizedEmail)
    if (existing) {
      throw new HttpsError('already-exists', 'Ya existe una cuenta con este correo.')
    }
  } catch (error) {
    if (error instanceof HttpsError) throw error
    // auth/user-not-found es el caso esperado.
  }

  const user = await auth.createUser({
    email: normalizedEmail,
    password,
    displayName: nombre.trim(),
    emailVerified: false,
  })

  await auth.setCustomUserClaims(user.uid, { rol })
  await db.doc(`users/${user.uid}`).set({
    uid: user.uid,
    nombre: nombre.trim(),
    email: normalizedEmail,
    rol,
    fechaCreacion: FieldValue.serverTimestamp(),
    creadoPor: callerUid,
  })

  logger.info('Cuenta de equipo creada', { uid: user.uid, rol, by: callerUid })
  return { ok: true, uid: user.uid }
})

/**
 * Normaliza y valida los mensajes del formulario público.
 * Las reglas de Firestore ya exigen los campos; aquí se limpian y
 * se archivan los mensajes demasiado cortos.
 */
export const sanitizeContactMessage = onDocumentCreated(
  { document: 'contact_messages/{messageId}', region: REGION },
  async (event) => {
    const snapshot = event.data
    if (!snapshot) return

    const data = snapshot.data()
    const clean = (value: unknown, max: number) =>
      typeof value === 'string' ? value.trim().slice(0, max) : ''

    const mensaje = clean(data.mensaje, 3000)
    const estados = ['nuevo', 'leido', 'archivado']
    const estadoElegido =
      data.origen === 'panel-admin' && estados.includes(data.estado) ? data.estado : null

    await snapshot.ref.update({
      nombre: clean(data.nombre, 120),
      email: clean(data.email, 160).toLowerCase(),
      telefono: clean(data.telefono, 40),
      asunto: clean(data.asunto, 120) || 'Información general',
      mensaje,
      estado: estadoElegido ?? (mensaje.length < 10 ? 'archivado' : 'nuevo'),
      fecha: data.fecha ?? FieldValue.serverTimestamp(),
    })

    logger.info('Mensaje de contacto procesado', { id: snapshot.id })
  },
)
