import { getDownloadURL, ref, uploadBytesResumable } from 'firebase/storage'
import { storage } from '../lib/firebase'
import { slugify } from '../utils/misc'

const MAX_INPUT_BYTES = 10 * 1024 * 1024
const ALLOWED_TYPES = ['image/jpeg', 'image/png', 'image/webp', 'image/avif']

export function validateImageFile(file) {
  if (!file) return 'Selecciona una imagen.'
  if (!ALLOWED_TYPES.includes(file.type)) {
    return 'Formato no permitido. Usa JPG, PNG, WEBP o AVIF.'
  }
  if (file.size > MAX_INPUT_BYTES) {
    return 'La imagen supera los 10 MB. Comprímela antes de subirla.'
  }
  return null
}

/** Redimensiona y convierte a WebP en el navegador antes de subir. */
async function optimize(file, { maxSize = 2200, quality = 0.86 } = {}) {
  try {
    const bitmap = await createImageBitmap(file)
    const scale = Math.min(1, maxSize / Math.max(bitmap.width, bitmap.height))
    const width = Math.max(1, Math.round(bitmap.width * scale))
    const height = Math.max(1, Math.round(bitmap.height * scale))

    const canvas = document.createElement('canvas')
    canvas.width = width
    canvas.height = height
    const context = canvas.getContext('2d')
    context.imageSmoothingQuality = 'high'
    context.drawImage(bitmap, 0, 0, width, height)
    bitmap.close?.()

    const blob = await new Promise((resolve) => canvas.toBlob(resolve, 'image/webp', quality))
    return blob ?? file
  } catch (error) {
    console.warn('[storage] No se pudo optimizar la imagen, se sube el original.', error)
    return file
  }
}

export async function uploadImage(file, folder = 'gallery', onProgress) {
  const validationError = validateImageFile(file)
  if (validationError) throw new Error(validationError)
  if (!storage) {
    throw new Error('Firebase Storage no está configurado.')
  }

  const blob = await optimize(file)
  const isWebp = blob.type === 'image/webp'
  const baseName = slugify(file.name.replace(/\.[^.]+$/, '')) || 'imagen'
  const path = `${folder}/${Date.now()}-${baseName}.${isWebp ? 'webp' : 'jpg'}`
  const objectRef = ref(storage, path)

  const task = uploadBytesResumable(objectRef, blob, {
    contentType: blob.type || 'image/jpeg',
    cacheControl: 'public,max-age=31536000,immutable',
  })

  if (onProgress) {
    task.on('state_changed', (snapshot) => {
      const progress = Math.round((snapshot.bytesTransferred / snapshot.totalBytes) * 100)
      onProgress(progress)
    })
  }

  await task
  const url = await getDownloadURL(task.snapshot.ref)
  if (onProgress) onProgress(100)
  return url
}
