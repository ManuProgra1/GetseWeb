import { useEffect, useRef } from 'react'
import { createPortal } from 'react-dom'
import { Icon } from '../common/icons'

export default function Modal({
  open,
  title,
  description,
  onClose,
  children,
  footer,
  size = 'md',
}) {
  const closeRef = useRef(null)
  const panelRef = useRef(null)
  const onCloseRef = useRef(onClose)

  // Mantiene la última versión de onClose sin volver a ejecutar el efecto:
  // si el efecto dependiera de onClose, cada tecla lo reiniciaría y robaría el foco.
  useEffect(() => {
    onCloseRef.current = onClose
  }, [onClose])

  useEffect(() => {
    if (!open) return undefined
    document.documentElement.style.overflow = 'hidden'

    const firstField = panelRef.current?.querySelector(
      'input:not([type="hidden"]), textarea, select',
    )
    ;(firstField || closeRef.current)?.focus()

    const onKey = (event) => {
      if (event.key === 'Escape') onCloseRef.current?.()
    }
    window.addEventListener('keydown', onKey)
    return () => {
      window.removeEventListener('keydown', onKey)
      document.documentElement.style.overflow = ''
    }
  }, [open])

  if (!open) return null

  const sizes = { sm: 'max-w-md', md: 'max-w-2xl', lg: 'max-w-4xl' }

  return createPortal(
    <div
      className="fixed inset-0 z-[400] flex items-start justify-center overflow-y-auto bg-[#101a16]/60 p-4 backdrop-blur-sm sm:items-center sm:p-8"
      role="dialog"
      aria-modal="true"
      aria-label={title}
      onMouseDown={(event) => {
        if (event.target === event.currentTarget) onClose()
      }}
    >
      <div
        ref={panelRef}
        className={`my-auto w-full ${sizes[size]} border border-[#25342e]/10 bg-[#faf7ea] shadow-2xl`}
      >
        <div className="flex items-start justify-between gap-4 border-b border-[#25342e]/10 px-6 py-5">
          <div>
            <h2 className="font-display text-2xl leading-tight text-[#1f2a26]">{title}</h2>
            {description && (
              <p className="mt-1 text-xs leading-relaxed text-[#5f6d66]">{description}</p>
            )}
          </div>
          <button
            ref={closeRef}
            type="button"
            onClick={onClose}
            aria-label="Cerrar"
            className="grid h-9 w-9 shrink-0 place-items-center rounded-full border border-[#25342e]/15 text-[#44544d] transition hover:border-[#25342e]/40"
          >
            <Icon name="close" size={16} />
          </button>
        </div>

        <div className="px-6 py-6">{children}</div>

        {footer && (
          <div className="flex flex-wrap items-center justify-end gap-3 border-t border-[#25342e]/10 bg-white/50 px-6 py-4">
            {footer}
          </div>
        )}
      </div>
    </div>,
    document.body,
  )
}
