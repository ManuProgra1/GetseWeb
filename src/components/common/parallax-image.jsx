import { useLayoutEffect, useRef } from 'react'
import { gsap } from '../../animations/register'
import { useReducedMotion } from '../../hooks/use-reduced-motion'

export default function ParallaxImage({
  src,
  alt,
  className = '',
  imageClassName = '',
  strength = 8,
  priority = false,
  overlay = true,
  children,
}) {
  const containerRef = useRef(null)
  const imageRef = useRef(null)
  const reduced = useReducedMotion()

  useLayoutEffect(() => {
    const container = containerRef.current
    const image = imageRef.current
    if (!container || !image || reduced) return undefined

    const tween = gsap.fromTo(
      image,
      { yPercent: -strength },
      {
        yPercent: strength,
        ease: 'none',
        scrollTrigger: {
          trigger: container,
          start: 'top bottom',
          end: 'bottom top',
          scrub: 0.6,
        },
      },
    )

    return () => {
      tween.scrollTrigger?.kill()
      tween.kill()
    }
  }, [strength, reduced])

  return (
    <div ref={containerRef} className={`relative overflow-hidden ${className}`}>
      <img
        ref={imageRef}
        src={src}
        alt={alt}
        loading={priority ? 'eager' : 'lazy'}
        decoding="async"
        className={`h-full w-full scale-110 object-cover ${imageClassName}`}
      />
      {overlay && <div className="absolute inset-0 bg-gradient-to-t from-ink/80 via-ink/10 to-transparent" />}
      {children}
    </div>
  )
}
