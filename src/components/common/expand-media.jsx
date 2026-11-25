import { useLayoutEffect, useRef } from 'react'
import { gsap } from '../../animations/register'
import { useMediaQuery, useReducedMotion } from '../../hooks/use-reduced-motion'

/**
 * Imagen que se expande de un encuadre contenido a pantalla completa
 * mientras el usuario hace scroll. Usa pin + clip-path (una sola capa)
 * y desactiva el efecto en móvil o con movimiento reducido.
 */
export default function ExpandMedia({
  image = '/images/iglesia.jpg',
  alt = '',
  eyebrow = 'Comunidad',
  title,
  caption,
  className = '',
}) {
  const sectionRef = useRef(null)
  const frameRef = useRef(null)
  const imageRef = useRef(null)
  const copyRef = useRef(null)
  const reduced = useReducedMotion()
  const isDesktop = useMediaQuery('(min-width: 768px)')
  const enabled = !reduced && isDesktop

  useLayoutEffect(() => {
    if (!enabled) return undefined

    const context = gsap.context(() => {
      const timeline = gsap.timeline({
        scrollTrigger: {
          trigger: sectionRef.current,
          start: 'top top',
          end: '+=130%',
          pin: true,
          scrub: 0.7,
          anticipatePin: 1,
          invalidateOnRefresh: true,
        },
      })

      timeline
        .fromTo(
          frameRef.current,
          { clipPath: 'inset(16% 26% 16% 26% round 22px)' },
          { clipPath: 'inset(0% 0% 0% 0% round 0px)', ease: 'none', duration: 1 },
          0,
        )
        .fromTo(imageRef.current, { scale: 1.32 }, { scale: 1, ease: 'none', duration: 1 }, 0)
        .fromTo(
          copyRef.current,
          { opacity: 0, y: 30 },
          { opacity: 1, y: 0, duration: 0.45, ease: 'power2.out' },
          0.35,
        )
    }, sectionRef)

    return () => context.revert()
  }, [enabled])

  return (
    <section
      ref={sectionRef}
      className={`grain relative h-[100svh] overflow-hidden bg-ink ${className}`}
      aria-label={typeof title === 'string' ? title : 'Imagen destacada de la iglesia'}
    >
      <div ref={frameRef} className="absolute inset-0 will-change-[clip-path]">
        <img
          ref={imageRef}
          src={image}
          alt={alt}
          loading="lazy"
          decoding="async"
          className="h-full w-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-ink via-ink/25 to-ink/45" />
        <div className="absolute inset-0 bg-[radial-gradient(80%_60%_at_50%_50%,transparent_20%,rgba(22,32,28,0.5)_100%)]" />

        <div ref={copyRef} className="absolute inset-x-0 bottom-0 z-10">
          <div className="shell pb-12 md:pb-20">
            <span className="eyebrow text-gold">{eyebrow}</span>
            {title && (
              <p className="display mt-4 max-w-4xl text-[clamp(2.2rem,6vw,5rem)] text-bone">{title}</p>
            )}
            {caption && (
              <p className="mt-5 max-w-md text-sm leading-relaxed text-bone/60">{caption}</p>
            )}
          </div>
        </div>
      </div>
    </section>
  )
}
