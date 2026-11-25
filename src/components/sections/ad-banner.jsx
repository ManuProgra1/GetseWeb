import { Link } from 'react-router-dom'
import { useCollection } from '../../hooks/use-collection'
import ParallaxImage from '../common/parallax-image'
import Reveal from '../common/reveal'
import { Icon } from '../common/icons'

/**
 * Banner publicitario administrado desde el panel. Solo se renderiza si
 * existe un anuncio publicado para la ubicación solicitada; nunca muestra
 * contenido de ejemplo.
 */
export default function AdBanner({ placement = 'inicio', className = '' }) {
  const { items } = useCollection('advertising', {
    published: true,
    order: ['orden', 'asc'],
    fallback: [],
  })

  const ad = items.find((item) => (item.ubicacion || 'inicio') === placement)
  if (!ad) return null

  const hasLink = Boolean(ad.enlace)
  const Action = hasLink ? 'a' : 'div'
  const actionProps = hasLink
    ? {
        href: ad.enlace,
        target: ad.enlace.startsWith('http') ? '_blank' : undefined,
        rel: ad.enlace.startsWith('http') ? 'noreferrer noopener' : undefined,
      }
    : {}

  return (
    <section className={`bg-ink py-16 sm:py-20 ${className}`} aria-label="Publicidad">
      <div className="shell">
        <div className="grid overflow-hidden border border-bone/10 bg-night/50 lg:grid-cols-[0.95fr_1.05fr]">
          {ad.imagen && (
            <ParallaxImage
              src={ad.imagen}
              alt={ad.titulo}
              className="aspect-[16/10] w-full lg:aspect-auto lg:h-full lg:min-h-[26rem]"
              strength={5}
              overlay={false}
            />
          )}

          <div className="flex flex-col justify-center p-7 sm:p-10 lg:p-14">
            <Reveal as="p" className="eyebrow flex items-center gap-3 text-gold" y={10}>
              <span className="h-px w-7 bg-gold/60" />
              {ad.etiqueta || 'Información'}
            </Reveal>

            <Reveal as="h2" className="display mt-5 text-[clamp(1.9rem,3.6vw,3.2rem)] text-bone" delay={0.06}>
              {ad.titulo}
            </Reveal>

            {ad.texto && (
              <Reveal as="p" className="mt-5 max-w-lg text-sm leading-relaxed text-bone/60 sm:text-base" delay={0.1}>
                {ad.texto}
              </Reveal>
            )}

            {hasLink && (
              <Reveal className="mt-8" delay={0.14}>
                <Action
                  {...actionProps}
                  className="group inline-flex items-center gap-3 rounded-full bg-sand px-6 py-3 text-[0.66rem] font-medium uppercase tracking-[0.18em] text-ink transition hover:bg-bone"
                >
                  Más información
                  <Icon
                    name={ad.enlace.startsWith('http') ? 'external' : 'arrow-up-right'}
                    size={14}
                    className="transition-transform duration-300 group-hover:translate-x-0.5"
                  />
                </Action>
              </Reveal>
            )}

            {!hasLink && (
              <Reveal className="mt-8" delay={0.14}>
                <Link
                  to="/contacto"
                  className="group inline-flex items-center gap-3 rounded-full border border-bone/25 px-6 py-3 text-[0.66rem] font-medium uppercase tracking-[0.18em] text-bone transition hover:border-gold/60 hover:text-gold"
                >
                  Consultar información
                  <Icon name="arrow-up-right" size={14} />
                </Link>
              </Reveal>
            )}
          </div>
        </div>
      </div>
    </section>
  )
}
