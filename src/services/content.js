import {
  addDoc,
  collection,
  deleteDoc,
  doc,
  serverTimestamp,
  setDoc,
  updateDoc,
} from 'firebase/firestore'
import { db } from '../lib/firebase'

export const COLLECTIONS = {
  users: 'users',
  events: 'events',
  ministries: 'ministries',
  history: 'history',
  gallery: 'gallery',
  messages: 'contact_messages',
  settings: 'settings',
}

function requireDb() {
  if (!db) {
    throw new Error(
      'Firebase no está configurado. Agrega las variables VITE_FIREBASE_* en un archivo .env y reinicia el servidor.',
    )
  }
  return db
}

/** Firestore rechaza valores undefined: se eliminan antes de escribir. */
function clean(payload) {
  return Object.fromEntries(
    Object.entries(payload).filter(([, value]) => value !== undefined),
  )
}

export async function createRecord(collectionName, payload) {
  const firestore = requireDb()
  const reference = await addDoc(collection(firestore, collectionName), {
    ...clean(payload),
    fechaCreacion: serverTimestamp(),
    fechaActualizacion: serverTimestamp(),
  })
  return reference.id
}

export async function updateRecord(collectionName, id, payload) {
  const firestore = requireDb()
  await updateDoc(doc(firestore, collectionName, id), {
    ...clean(payload),
    fechaActualizacion: serverTimestamp(),
  })
  return id
}

export async function deleteRecord(collectionName, id) {
  const firestore = requireDb()
  await deleteDoc(doc(firestore, collectionName, id))
  return id
}

export async function saveSettings(payload) {
  const firestore = requireDb()
  await setDoc(
    doc(firestore, COLLECTIONS.settings, 'main'),
    { ...clean(payload), fechaActualizacion: serverTimestamp() },
    { merge: true },
  )
}

export async function sendContactMessage({ nombre, email, telefono, asunto, mensaje }) {
  const firestore = requireDb()
  const reference = await addDoc(collection(firestore, COLLECTIONS.messages), {
    nombre: nombre.trim(),
    email: email.trim().toLowerCase(),
    telefono: telefono?.trim() ?? '',
    asunto: asunto ?? 'Información general',
    mensaje: mensaje.trim(),
    estado: 'nuevo',
    origen: 'sitio-web',
    fecha: serverTimestamp(),
    fechaCreacion: serverTimestamp(),
    fechaActualizacion: serverTimestamp(),
  })
  return reference.id
}
