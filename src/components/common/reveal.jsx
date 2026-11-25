import { useLayoutEffect, useRef } from 'react'
import { gsap } from '../../animations/register'
import { useReducedMotion } from '../../hooks/use-reduced-motion'

export default function Reveal({
  as: Tag = 'div',
  children,
  className = '',
  y = 26,
  delay = 0,
  duration = 1,
  start = 'top 90%',
  once = true,
  ...rest
}) {
  const ref = useRef(null)
  const reduced = useReducedMotion()

  useLayoutEffect(() => {
    const element = ref.current
    if (!element || reduced) return undefined

    const tween = gsap.fromTo(
      element,
      { y, opacity: 0 },
      {
        y: 0,
        opacity: 1,
        duration,
        delay,
        ease: 'power3.out',
        scrollTrigger: { trigger: element, start, once },
      },
    )

    return () => {
      tween.scrollTrigger?.kill()
      tween.kill()
    }
  }, [y, delay, duration, start, once, reduced])

  return (
    <Tag ref={ref} className={className} {...rest}>
      {children}
    </Tag>
  )
}
