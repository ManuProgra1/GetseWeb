import { useLayoutEffect, useRef } from 'react'
import { gsap } from '../../animations/register'
import { useMediaQuery, useReducedMotion } from '../../hooks/use-reduced-motion'
import SplitHeading from '../common/split-heading'
import Button from '../common/button'

export default function Hero() {
  const rootRef = useRef(null)
  const imageRef = useRef(null)
  const contentRef = useRef(null)
  const eyebrowRef = useRef(null)
  const leadRef = useRef(null)
  const actionsRef = useRef(null)
  const reduced = useReducedMotion()
  const finePointer = useMediaQuery('(hover: hover) and (pointer: fine)')

  useLayoutEffect(() => {
    if (reduced) return undefined

    const context = gsap.context(() => {
      gsap.fromTo(
        imageRef.current,
        { scale: 1.16, opacity: 0.4 },
        { scale: 1, opacity: 1, duration: 2.2, ease: 'power2.out', delay: 0.45 },
      )

      const intro = gsap.timeline({ delay: 0.85 })
      intro
        .fromTo(eyebrowRef.current, { opacity: 0, y: 14 }, { opacity: 1, y: 0, duration: 0.8 })
        .fromTo(
          [leadRef.current, actionsRef.current],
          { opacity: 0, y: 22 },
          { opacity: 1, y: 0, duration: 0.9, stagger: 0.12 },
          '-=0.35',
        )

      gsap.to(imageRef.current, {
        yPercent: 14,
        ease: 'none',
        scrollTrigger: {
          trigger: rootRef.current,
          start: 'top top',
          end: 'bottom top',
          scrub: 0.5,
        },
      })

      gsap.to(contentRef.current, {
        yPercent: -6,
        opacity: 0.25,
        ease: 'none',
        scrollTrigger: {
          trigger: rootRef.current,
          start: 'top top',
          end: 'bottom top',
          scrub: 0.5,
        },
      })
    }, rootRef)

    let moveTo = null
    let handleMove = null

    if (finePointer) {
      moveTo = {
        x: gsap.quickTo(imageRef.current, 'x', { duration: 1.4, ease: 'power2.out' }),
        y: gsap.quickTo(imageRef.current, 'y', { duration: 1.4, ease: 'power2.out' }),
      }
      handleMove = (event) => {
        const rect = rootRef.current.getBoundingClientRect()
        const x = ((event.clientX - rect.left) / rect.width - 0.5) * 22
        const y = ((event.clientY - rect.top) / rect.height - 0.5) * 18
        moveTo.x(x)
        moveTo.y(y)
      }
      rootRef.current.addEventListener('pointermove', handleMove)
    }

    return () => {
      context.revert()
      if (handleMove) rootRef.current?.removeEventListener('pointermove', handleMove)
    }
  }, [reduced, finePointer])

  return (
    <section
      ref={rootRef}
      className="grain relative flex min-h-[100svh] flex-col overflow-hidden bg-ink"
      aria-label="Bienvenida"
    >
      <div className="absolute inset-0 -z-10 overflow-hidden">
        <img
          ref={imageRef}
          src="/images/iglesia.jpg"
          alt="Congregación reunida en adoración en el templo de Asambleas de Dios Getsemaní"
          fetchPriority="high"
          className="h-full w-full scale-105 object-cover object-[center_45%] will-change-transform"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-ink/85 via-ink/55 to-ink" />
        <div className="absolute inset-0 bg-[radial-gradient(70%_60%_at_72%_28%,rgba(230,201,161,0.22),transparent_62%)]" />
        <div className="absolute inset-0 bg-[radial-gradient(60%_60%_at_10%_80%,rgba(84,121,114,0.35),transparent_65%)]" />
        <div className="absolute inset-0 bg-[linear-gradient(90deg,rgba(22,32,28,0.72)_0%,rgba(22,32,28,0.15)_55%,transparent_100%)]" />
      </div>

      <div
        ref={contentRef}
        className="shell relative flex flex-1 flex-col justify-end pt-36 pb-16 sm:pb-24"
      >
        <div className="flex items-center gap-4">
          <span className="h-px w-10 bg-gold/70" />
          <p ref={eyebrowRef} className="eyebrow text-gold">
            Asambleas de Dios · Guatemala
          </p>
        </div>

        <SplitHeading
          as="h1"
          mode="chars"
          trigger={false}
          delay={0.7}
          charStagger={0.014}
          className="display mt-7 max-w-[15ch] text-[clamp(2.7rem,7.6vw,7.4rem)] text-bone"
        >
          Bienvenidos a <span className="text-bone/60">Asambleas de Dios</span>{' '}
          <em className="text-gold italic">Getsemaní</em>
        </SplitHeading>

        <div className="mt-8 flex flex-col gap-8 lg:flex-row lg:items-end lg:justify-between">
          <div ref={leadRef} className="max-w-xl">
            <p className="text-base leading-relaxed text-bone/75 sm:text-lg">
              Un lugar para encontrarte con Dios, crecer en la fe y caminar en comunidad.
              Te esperamos con la puerta abierta y un lugar en la mesa.
            </p>
          </div>

          <div ref={actionsRef} className="flex flex-wrap gap-3">
            <Button to="/nosotros" size="lg">
              Conoce la iglesia
            </Button>
            <Button to="/ministerios" variant="outline" size="lg" icon="arrow-up-right">
              Descubre los ministerios
            </Button>
          </div>
        </div>
      </div>
    </section>
  )
}
