import { ScrollTrigger } from './register'

let timer = null

/** Recalcula posiciones después de que el contenido dinámico cambia de altura. */
export function scheduleRefresh(delay = 200) {
  if (typeof window === 'undefined') return
  window.clearTimeout(timer)
  timer = window.setTimeout(() => ScrollTrigger.refresh(), delay)
}
