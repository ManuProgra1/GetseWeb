import {
  addDoc,
  collection,
  deleteDoc,
  doc,
  getDocs,
  limit,
  query,
  serverTimestamp,
  updateDoc,
  where,
} from 'firebase/firestore'
import { db } from '../lib/firebase'
import { isEmail } from '../utils/misc'

/**
 * Registros de formularios. Todos los envíos del sitio se guardan en
 * `contact_messages`; el panel administrativo opera sobre la misma colección,
 * por lo que cualquier cambio se refleja en tiempo real en el resto del sitio.
 */
export const RECORDS_COLLECTION = 'contact_messages'

export const RECORD_STATES = ['nuevo', 'leido', 'archivado']

const LIMITS = {
  nombre: 120,
  email: 160,
  telefono: 40,
  asunto: 120,
  mensaje: 3000,
}

function requireDb() {
  if (!db) {
    throw new Error(
      'Firebase no está configurado. Agrega las variables VITE_FIREBASE_* en un archivo .env y reinicia el servidor.',
    )
  }
  return db
}

function normalize(values = {}) {
  return {
    nombre: String(values.nombre ?? '').trim(),
    email: String(values.email ?? '').trim().toLowerCase(),
    telefono: String(values.telefono ?? '').trim(),
    asunto: String(values.asunto ?? '').trim() || 'Información general',
    mensaje: String(values.mensaje ?? '').trim(),
    estado: RECORD_STATES.includes(values.estado) ? values.estado : 'nuevo',
  }
}

function withFieldErrors(errors) {
  const error = new Error('Revisa los campos marcados antes de guardar.')
  error.fieldErrors = errors
  return error
}

/** Validación compartida por el formulario y el servicio antes de escribir. */
export function validateRecord(values = {}) {
  const data = normalize(values)
  const errors = {}

  if (data.nombre.length < 2) {
    errors.nombre = 'Escribe el nombre (mínimo 2 caracteres).'
  } else if (data.nombre.length > LIMITS.nombre) {
    errors.nombre = `El nombre no puede superar ${LIMITS.nombre} caracteres.`
  }

  if (!isEmail(data.email)) {
    errors.email = 'Ingresa un correo electrónico válido.'
  } else if (data.email.length > LIMITS.email) {
    errors.email = `El correo no puede superar ${LIMITS.email} caracteres.`
  }

  if (data.telefono.length > LIMITS.telefono) {
    errors.telefono = 'El teléfono es demasiado largo.'
  }

  if (data.asunto.length > LIMITS.asunto) {
    errors.asunto = `El asunto no puede superar ${LIMITS.asunto} caracteres.`
  }

  if (data.mensaje.length < 10) {
    errors.mensaje = 'El mensaje debe tener al menos 10 caracteres.'
  } else if (data.mensaje.length > LIMITS.mensaje) {
    errors.mensaje = `El mensaje no puede superar ${LIMITS.mensaje} caracteres.`
  }

  if (!RECORD_STATES.includes(data.estado)) {
    errors.estado = 'Selecciona un estado válido.'
  }

  return errors
}

async function findDuplicate(firestore, data, ignoreId = null) {
  const snapshot = await getDocs(
    query(
      collection(firestore, RECORDS_COLLECTION),
      where('email', '==', data.email),
      limit(25),
    ),
  )
  const target = data.mensaje.toLowerCase()
  const duplicate = snapshot.docs.find((entry) => {
    if (entry.id === ignoreId) return false
    const existing = entry.data()
    return String(existing.mensaje ?? '').trim().toLowerCase() === target
  })
  return duplicate ?? null
}

export async function createFormRecord(values) {
  const firestore = requireDb()
  const errors = validateRecord(values)
  if (Object.keys(errors).length) throw withFieldErrors(errors)

  const data = normalize(values)
  const duplicate = await findDuplicate(firestore, data)
  if (duplicate) {
    const error = new Error(
      'Ya existe un registro con este correo y el mismo mensaje. Revisa la tabla antes de crear un duplicado.',
    )
    error.code = 'duplicate'
    throw error
  }

  const reference = await addDoc(collection(firestore, RECORDS_COLLECTION), {
    ...data,
    origen: 'panel-admin',
    fecha: serverTimestamp(),
    fechaCreacion: serverTimestamp(),
    fechaActualizacion: serverTimestamp(),
  })
  return reference.id
}

export async function updateFormRecord(id, values) {
  const firestore = requireDb()
  if (!id) throw new Error('El registro no tiene un identificador válido.')

  const errors = validateRecord(values)
  if (Object.keys(errors).length) throw withFieldErrors(errors)

  const data = normalize(values)
  const duplicate = await findDuplicate(firestore, data, id)
  if (duplicate) {
    const error = new Error(
      'Otro registro ya tiene este correo con el mismo mensaje. Edita el existente o cambia el contenido.',
    )
    error.code = 'duplicate'
    throw error
  }

  await updateDoc(doc(firestore, RECORDS_COLLECTION, id), {
    ...data,
    fechaActualizacion: serverTimestamp(),
  })
  return id
}

export async function deleteFormRecord(id) {
  const firestore = requireDb()
  if (!id) throw new Error('El registro no tiene un identificador válido.')
  await deleteDoc(doc(firestore, RECORDS_COLLECTION, id))
  return id
}
