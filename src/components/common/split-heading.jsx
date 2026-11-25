import { useLayoutEffect, useRef } from 'react'
import { gsap, SplitText } from '../../animations/register'
import { useReducedMotion } from '../../hooks/use-reduced-motion'

/**
 * Revelado tipográfico por líneas (o caracteres) con máscara.
 * El texto permanece visible si el plugin falla o el usuario prefiere
 * movimiento reducido.
 */
export default function SplitHeading({
  as: Tag = 'h2',
  children,
  className = '',
  mode = 'lines',
  delay = 0,
  lineStagger = 0.1,
  charStagger = 0.016,
  trigger = true,
  start = 'top 88%',
}) {
  const ref = useRef(null)
  const reduced = useReducedMotion()

  useLayoutEffect(() => {
    const element = ref.current
    if (!element || reduced) return undefined

    let split = null
    let tween = null

    try {
      split = SplitText.create(element, {
        type: mode === 'chars' ? 'lines,chars' : 'lines',
        mask: 'lines',
        linesClass: 'split-line',
        charsClass: 'char',
      })

      const targets = mode === 'chars' ? split.chars : split.lines
      tween = gsap.fromTo(
        targets,
        { yPercent: 118, opacity: 0 },
        {
          yPercent: 0,
          opacity: 1,
          duration: mode === 'chars' ? 1.15 : 1,
          stagger: mode === 'chars' ? charStagger : lineStagger,
          delay,
          ease: 'power3.out',
          scrollTrigger: trigger
            ? { trigger: element, start, once: true }
            : undefined,
        },
      )
    } catch (error) {
      console.warn('[animation] SplitText no disponible:', error)
      gsap.set(element, { opacity: 1 })
    }

    return () => {
      tween?.scrollTrigger?.kill()
      tween?.kill()
      split?.revert()
    }
  }, [children, mode, delay, lineStagger, charStagger, trigger, start, reduced])

  return (
    <Tag ref={ref} className={className}>
      {children}
    </Tag>
  )
}
