import { signInWithEmailAndPassword, signOut } from 'firebase/auth'
import { doc, getDoc, updateDoc } from 'firebase/firestore'
import { httpsCallable } from 'firebase/functions'
import { auth, db, functions } from '../lib/firebase'

/**
 * Firebase Authentication exige un correo para el acceso con contraseña.
 * El panel usa nombres de usuario cortos (admin, user) que se traducen a
 * este dominio interno, sin buzón real.
 */
export const USERNAME_DOMAIN = 'getsemani.local'

export function usernameToEmail(username) {
  const value = String(username ?? '').trim().toLowerCase()
  if (!value) return ''
  if (value.includes('@')) return value
  return `${value}@${USERNAME_DOMAIN}`
}

export async function signInRequest(username, password) {
  if (!auth) {
    throw new Error('Firebase Authentication no está configurado.')
  }
  const credential = await signInWithEmailAndPassword(auth, usernameToEmail(username), password)
  return credential.user
}

export async function signOutRequest() {
  if (auth) await signOut(auth)
}

export async function fetchProfile(uid) {
  if (!db || !uid) return null
  const snapshot = await getDoc(doc(db, 'users', uid))
  return snapshot.exists() ? { id: snapshot.id, ...snapshot.data() } : null
}

const FUNCTION_FALLBACK_CODES = new Set([
  'functions/not-found',
  'functions/unavailable',
  'functions/failed-precondition',
])

/**
 * Cambia el rol de un usuario. Usa la Cloud Function `setUserRole`
 * (Admin SDK, incluye custom claims). Si las functions aún no están
 * desplegadas, aplica la actualización directa permitida por las reglas
 * de Firestore para administradores.
 */
export async function updateUserRole(uid, rol) {
  if (functions) {
    try {
      const callable = httpsCallable(functions, 'setUserRole')
      const { data } = await callable({ uid, rol })
      return { ...data, viaFunction: true }
    } catch (error) {
      console.warn('[auth] setUserRole no disponible:', error?.code)
      if (!FUNCTION_FALLBACK_CODES.has(error?.code)) throw error
    }
  }

  if (!db) throw new Error('Firestore no está configurado.')
  await updateDoc(doc(db, 'users', uid), { rol })
  return { ok: true, viaFunction: false }
}

/** Crea una cuenta de equipo. Requiere la Cloud Function createStaffUser. */
export async function createStaffUser({ email, password, nombre, rol }) {
  if (!functions) {
    throw new Error(
      'La creación de usuarios requiere las Cloud Functions desplegadas.',
    )
  }
  const callable = httpsCallable(functions, 'createStaffUser')
  const { data } = await callable({ email, password, nombre, rol })
  return data
}
