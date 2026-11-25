import { ScrollSmoother } from './register'
import { ScrollTrigger } from './register'

let smoother = null

/**
 * ScrollSmoother solo se activa en escritorio con puntero fino.
 * Si algo falla, el sitio continúa con el scroll nativo.
 */
export function initSmoothScroll() {
  if (smoother) return smoother

  const wrapper = document.getElementById('smooth-wrapper')
  const content = document.getElementById('smooth-content')
  if (!wrapper || !content) return null

  try {
    smoother = ScrollSmoother.create({
      wrapper,
      content,
      smooth: 1.15,
      smoothTouch: 0.06,
      effects: false,
      normalizeScroll: false,
    })
    document.documentElement.classList.add('has-smooth')
    ScrollTrigger.refresh()
  } catch (error) {
    console.warn('[scroll] ScrollSmoother no disponible, usando scroll nativo.', error)
    smoother = null
  }

  return smoother
}

export function getSmoothScroll() {
  return smoother
}

export function killSmoothScroll() {
  if (!smoother) return
  smoother.kill()
  smoother = null
  document.documentElement.classList.remove('has-smooth')
}

export function scrollToTop(immediate = true) {
  if (smoother) {
    smoother.scrollTo(0, immediate)
  } else {
    window.scrollTo({ top: 0, behavior: immediate ? 'auto' : 'smooth' })
  }
}
