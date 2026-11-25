import { createContext, useCallback, useContext, useMemo, useRef, useState } from 'react'
import { Icon } from '../components/common/icons'

const ToastContext = createContext(null)

const VARIANTS = {
  success: {
    title: 'Todo listo',
    icon: 'check',
    accent: '#4f7363',
    soft: '#eaf1ea',
  },
  error: {
    title: 'Algo no salió bien',
    icon: 'close',
    accent: '#b4653f',
    soft: '#f9ece4',
  },
  info: {
    title: 'Información',
    icon: 'sparkle',
    accent: '#4c7480',
    soft: '#e9f1f4',
  },
  warning: {
    title: 'Revisa esto',
    icon: 'lock',
    accent: '#a8813a',
    soft: '#f8f0dd',
  },
}

const DURATION = 5200

export function ToastProvider({ children }) {
  const [toasts, setToasts] = useState([])
  const timers = useRef(new Map())

  const dismiss = useCallback((id) => {
    setToasts((current) => current.filter((toast) => toast.id !== id))
    const timer = timers.current.get(id)
    if (timer) {
      window.clearTimeout(timer)
      timers.current.delete(id)
    }
  }, [])

  const notify = useCallback(
    (message, type = 'success') => {
      const id = `${Date.now()}-${Math.random().toString(16).slice(2)}`
      const variant = VARIANTS[type] ? type : 'success'
      setToasts((current) => [...current.slice(-2), { id, message, type: variant }])
      const timer = window.setTimeout(() => dismiss(id), DURATION)
      timers.current.set(id, timer)
      return id
    },
    [dismiss],
  )

  const value = useMemo(() => ({ notify, dismiss }), [notify, dismiss])

  return (
    <ToastContext.Provider value={value}>
      {children}

      <div
        className="pointer-events-none fixed inset-x-3 top-20 z-[400] flex flex-col items-center gap-2.5 sm:inset-x-auto sm:top-24 sm:right-6 sm:items-end"
        role="status"
        aria-live="polite"
      >
        {toasts.map((toast) => {
          const variant = VARIANTS[toast.type] || VARIANTS.success
          const progress = Math.round((DURATION / 1000) * 100) / 100

          return (
            <div
              key={toast.id}
              className="toast-card pointer-events-auto relative w-full max-w-sm overflow-hidden border border-ink/10 shadow-[0_28px_60px_-24px_rgba(16,24,20,0.5)] sm:w-96"
              style={{
                '--toast-accent': variant.accent,
                background: `linear-gradient(135deg, ${variant.soft} 0%, #fefdf0 62%)`,
              }}
            >
              <span
                aria-hidden="true"
                className="absolute inset-y-0 left-0 w-[3px]"
                style={{ background: variant.accent }}
              />

              <div className="flex items-start gap-3 py-4 pr-3 pl-5">
                <span
                  className="toast-icon grid h-9 w-9 shrink-0 place-items-center rounded-full"
                  style={{
                    background: '#fefdf0',
                    color: variant.accent,
                    boxShadow: `0 0 0 1px ${variant.accent}33, 0 6px 14px -8px ${variant.accent}`,
                  }}
                  aria-hidden="true"
                >
                  <Icon name={variant.icon} size={16} />
                </span>

                <div className="min-w-0 flex-1">
                  <p
                    className="font-mono text-[0.55rem] uppercase tracking-[0.22em]"
                    style={{ color: variant.accent }}
                  >
                    {variant.title}
                  </p>
                  <p className="mt-1 text-[0.86rem] leading-snug text-ink/80">
                    {toast.message}
                  </p>
                </div>

                <button
                  type="button"
                  onClick={() => dismiss(toast.id)}
                  aria-label="Cerrar notificación"
                  className="grid h-7 w-7 shrink-0 place-items-center rounded-full text-ink/35 transition hover:bg-ink/5 hover:text-ink"
                >
                  <Icon name="close" size={13} />
                </button>
              </div>

              <span
                aria-hidden="true"
                className="toast-progress"
                style={{ background: variant.accent, animationDuration: `${progress}s` }}
              />
            </div>
          )
        })}
      </div>
    </ToastContext.Provider>
  )
}

export function useToast() {
  const context = useContext(ToastContext)
  if (!context) throw new Error('useToast debe usarse dentro de ToastProvider')
  return context
}
