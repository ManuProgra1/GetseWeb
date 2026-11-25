import { useRef, useState } from 'react'
import { uploadImage, validateImageFile } from '../../services/storage'
import { Icon } from '../common/icons'

export default function ImageUploader({
  value,
  onChange,
  folder = 'gallery',
  label = 'Imagen',
  hint = 'JPG, PNG, WEBP o AVIF · máximo 10 MB. Se optimiza automáticamente.',
}) {
  const inputRef = useRef(null)
  const [uploading, setUploading] = useState(false)
  const [progress, setProgress] = useState(0)
  const [error, setError] = useState('')

  const handleFile = async (event) => {
    const file = event.target.files?.[0]
    if (!file) return
    const validation = validateImageFile(file)
    if (validation) {
      setError(validation)
      event.target.value = ''
      return
    }
    setError('')
    setUploading(true)
    setProgress(0)
    try {
      const url = await uploadImage(file, folder, setProgress)
      onChange(url)
    } catch (uploadError) {
      console.error(uploadError)
      setError(uploadError.message || 'No se pudo subir la imagen.')
    } finally {
      setUploading(false)
      setProgress(0)
      event.target.value = ''
    }
  }

  return (
    <div>
      {label && <span className="admin-label">{label}</span>}

      <div className="flex flex-col gap-3 sm:flex-row">
        <div className="relative h-24 w-36 shrink-0 overflow-hidden rounded border border-[#25342e]/15 bg-[#25342e]/5">
          {value ? (
            <img src={value} alt="" className="h-full w-full object-cover" />
          ) : (
            <span className="grid h-full w-full place-items-center text-[#7d8a82]">
              <Icon name="image" size={22} />
            </span>
          )}
          {uploading && (
            <span className="absolute inset-0 grid place-items-center bg-[#1f2a26]/60 text-[0.65rem] text-white">
              {progress}%
            </span>
          )}
        </div>

        <div className="flex-1">
          <div className="flex flex-wrap gap-2">
            <button
              type="button"
              onClick={() => inputRef.current?.click()}
              disabled={uploading}
              className="inline-flex items-center gap-2 rounded-full border border-[#25342e]/20 px-4 py-2 text-[0.62rem] font-medium uppercase tracking-[0.14em] text-[#25342e] transition hover:border-[#25342e]/50 disabled:opacity-50"
            >
              <Icon name="upload" size={13} />
              {uploading ? 'Subiendo…' : value ? 'Reemplazar' : 'Subir imagen'}
            </button>
            {value && (
              <button
                type="button"
                onClick={() => onChange('')}
                className="inline-flex items-center gap-2 rounded-full px-3 py-2 text-[0.62rem] uppercase tracking-[0.14em] text-[#9b4a32] transition hover:bg-[#9b4a32]/5"
              >
                <Icon name="trash" size={13} />
                Quitar
              </button>
            )}
          </div>

          <input
            ref={inputRef}
            type="file"
            accept="image/jpeg,image/png,image/webp,image/avif"
            onChange={handleFile}
            className="hidden"
          />

          <input
            type="url"
            value={value || ''}
            onChange={(event) => onChange(event.target.value)}
            placeholder="o pega una URL de imagen"
            className="admin-input mt-2 text-xs"
          />

          {uploading && (
            <div className="mt-2 h-1 w-full overflow-hidden rounded-full bg-[#25342e]/10">
              <div
                className="h-full bg-[#547972] transition-all duration-300"
                style={{ width: `${progress}%` }}
              />
            </div>
          )}

          {error ? (
            <p className="mt-1.5 text-[0.72rem] text-[#9b4a32]">{error}</p>
          ) : (
            <p className="mt-1.5 text-[0.7rem] text-[#7d8a82]">{hint}</p>
          )}
        </div>
      </div>
    </div>
  )
}
