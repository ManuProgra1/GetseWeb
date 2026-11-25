import { useEffect } from 'react'
import { createPortal } from 'react-dom'
import { Icon } from './icons'

export default function Lightbox({ items, index, onClose, onNavigate }) {
  const isOpen = index !== null && index !== undefined && items?.length > 0

  useEffect(() => {
    if (!isOpen) return undefined
    document.documentElement.style.overflow = 'hidden'

    const handleKey = (event) => {
      if (event.key === 'Escape') onClose()
      if (event.key === 'ArrowRight') onNavigate((index + 1) % items.length)
      if (event.key === 'ArrowLeft') onNavigate((index - 1 + items.length) % items.length)
    }

    window.addEventListener('keydown', handleKey)
    return () => {
      window.removeEventListener('keydown', handleKey)
      document.documentElement.style.overflow = ''
    }
  }, [isOpen, index, items?.length, onClose, onNavigate])

  if (!isOpen) return null

  const item = items[index]
  const image = item.imagen || item.image

  return createPortal(
    <div
      role="dialog"
      aria-modal="true"
      aria-label={item.titulo || 'Galería'}
      className="fixed inset-0 z-[500] flex flex-col bg-ink/95 backdrop-blur-md"
    >
      <div className="flex items-center justify-between border-b border-bone/10 px-5 py-4 sm:px-8">
        <div>
          <p className="text-sm text-bone/90">{item.titulo}</p>
          {item.descripcion && (
            <p className="mt-1 max-w-xl text-xs text-bone/45">{item.descripcion}</p>
          )}
        </div>
        <button
          type="button"
          onClick={onClose}
          aria-label="Cerrar"
          className="grid h-10 w-10 place-items-center rounded-full border border-bone/20 text-bone/80 transition hover:border-gold/60 hover:text-gold"
        >
          <Icon name="close" size={18} />
        </button>
      </div>

      <div className="relative flex flex-1 items-center justify-center overflow-hidden p-4 sm:p-10">
        <img
          src={image}
          alt={item.titulo || ''}
          className="max-h-full max-w-full object-contain"
        />

        {items.length > 1 && (
          <>
            <button
              type="button"
              onClick={() => onNavigate((index - 1 + items.length) % items.length)}
              aria-label="Anterior"
              className="absolute left-3 grid h-11 w-11 place-items-center rounded-full border border-bone/20 bg-ink/60 text-bone transition hover:border-gold/60 hover:text-gold sm:left-6"
            >
              <Icon name="chevron-left" size={18} />
            </button>
            <button
              type="button"
              onClick={() => onNavigate((index + 1) % items.length)}
              aria-label="Siguiente"
              className="absolute right-3 grid h-11 w-11 place-items-center rounded-full border border-bone/20 bg-ink/60 text-bone transition hover:border-gold/60 hover:text-gold sm:right-6"
            >
              <Icon name="chevron-right" size={18} />
            </button>
          </>
        )}
      </div>

      <p className="pb-5 text-center font-mono text-[0.6rem] uppercase tracking-[0.3em] text-bone/35">
        {index + 1} / {items.length}
      </p>
    </div>,
    document.body,
  )
}
