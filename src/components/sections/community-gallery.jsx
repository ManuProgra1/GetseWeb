import { useRef } from 'react'
import { gsap } from '../../animations/register'
import { useScene } from '../../animations/use-scene'
import { useReducedMotion } from '../../hooks/use-reduced-motion'
import ParallaxImage from '../common/parallax-image'
import Reveal from '../common/reveal'
import SplitHeading from '../common/split-heading'

const PHOTOS = [
  {
    src: '/images/horizontal/horizontal-alabanza.jpg',
    alt: 'Equipo de alabanza sirviendo en el culto',
    caption: 'Adoración que prepara el corazón',
    className: 'lg:col-span-7 aspect-[16/10]',
    speed: 4,
  },
  {
    src: '/images/concilio-misionero-femenil.jpg',
    alt: 'Encuentro del concilio misionero femenil',
    caption: 'Misión que se sostiene en oración',
    className: 'lg:col-span-5 aspect-[16/10]',
    speed: 6,
  },
  {
    src: '/images/horizontal/horizontal-orando.jpg',
    alt: 'Congregación orando en el templo',
    caption: 'Un pueblo que ora',
    className: 'lg:col-span-4 aspect-[4/3]',
    speed: 7,
  },
  {
    src: '/images/horizontal/horizontal-biblia.jpg',
    alt: 'Biblia abierta durante la enseñanza',
    caption: 'La Escritura como fundamento',
    className: 'lg:col-span-4 aspect-[4/3]',
    speed: 5,
  },
  {
    src: '/images/horizontal/horizontal-biblia-titulos.jpg',
    alt: 'Detalle de una Biblia abierta',
    caption: 'Fe que se comparte',
    className: 'lg:col-span-4 aspect-[4/3]',
    speed: 6,
  },
  {
    src: '/images/horizontal/horizontal-predica.jpg',
    alt: 'Predicación durante un culto de la iglesia',
    caption: 'La Palabra, centro de cada reunión',
    className: 'lg:col-span-5 aspect-[16/10]',
    speed: 5,
  },
  {
    src: '/images/horizontal/horizontal-congregacion.jpg',
    alt: 'Familia de la iglesia reunida',
    caption: 'Una sola familia',
    className: 'lg:col-span-7 aspect-[16/10]',
    speed: 4,
  },
]

export default function CommunityGallery() {
  const reduced = useReducedMotion()
  const gridRef = useRef(null)

  const scope = useScene(
    (section) => {
      if (reduced) return
      section.querySelectorAll('[data-photo]').forEach((figure, index) => {
        gsap.fromTo(
          figure,
          { clipPath: 'inset(14% 14% 14% 14%)', opacity: 0.35 },
          {
            clipPath: 'inset(0% 0% 0% 0%)',
            opacity: 1,
            duration: 1.1,
            ease: 'power3.out',
            delay: (index % 3) * 0.06,
            scrollTrigger: { trigger: figure, start: 'top 88%', once: true },
          },
        )
      })
    },
    [reduced],
  )

  return (
    <section ref={scope} className="grain relative overflow-hidden bg-ink py-20 sm:py-28">
      <div className="shell">
        <div className="flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
          <div>
            <Reveal as="p" className="eyebrow flex items-center gap-3 text-gold/90" y={10}>
              <span className="h-px w-7 bg-gold/60" />
              La vida de la iglesia
            </Reveal>
            <SplitHeading
              as="h2"
              className="display mt-5 max-w-[18ch] text-[clamp(2rem,4.8vw,4.2rem)] text-bone"
            >
              Momentos que nos <em className="text-gold italic">forman</em>.
            </SplitHeading>
          </div>
          <Reveal as="p" className="max-w-sm text-sm leading-relaxed text-bone/55" delay={0.08}>
            Cultos, oración, ministerios y servicio: la vida de Getsemaní en imágenes.
          </Reveal>
        </div>

        <div ref={gridRef} className="mt-12 grid gap-4 sm:grid-cols-2 lg:grid-cols-12">
          {PHOTOS.map((photo, index) => (
            <figure
              key={photo.src}
              data-photo
              className={`group relative overflow-hidden ${photo.className}`}
            >
              <ParallaxImage
                src={photo.src}
                alt={photo.alt}
                className="h-full w-full"
                strength={photo.speed}
                priority={index === 0}
              >
                <figcaption className="absolute inset-x-0 bottom-0 z-10 bg-gradient-to-t from-ink/95 via-ink/50 to-transparent p-5 sm:p-6">
                  <span className="font-mono text-[0.55rem] uppercase tracking-[0.2em] text-sand">
                    {String(index + 1).padStart(2, '0')}
                  </span>
                  <p className="mt-1.5 font-display text-xl leading-snug text-bone sm:text-2xl">
                    {photo.caption}
                  </p>
                </figcaption>
              </ParallaxImage>
            </figure>
          ))}
        </div>
      </div>
    </section>
  )
}
