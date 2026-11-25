import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { SplitText } from 'gsap/SplitText'
import { ScrollSmoother } from 'gsap/ScrollSmoother'

/**
 * Punto único de registro de GSAP. Todos los módulos importan desde aquí
 * para evitar registrar plugins más de una vez.
 */
if (!gsap.core.globals().ScrollTrigger) {
  gsap.registerPlugin(ScrollTrigger, SplitText, ScrollSmoother)
}

gsap.defaults({ ease: 'power3.out', duration: 0.9 })
ScrollTrigger.config({ ignoreMobileResize: true })

export { gsap, ScrollTrigger, SplitText, ScrollSmoother }
