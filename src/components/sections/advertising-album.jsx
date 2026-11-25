import { useState } from 'react'
import { Link } from 'react-router-dom'
import Lightbox from '../common/lightbox'
import Reveal from '../common/reveal'
import { Icon } from '../common/icons'
import { useCollection } from '../../hooks/use-collection'

/**
 * Álbum de publicidad de la semana. Se alimenta de los anuncios publicados
 * desde el panel (ubicación "Inicio"). Si no hay anuncios reales, no se
 * muestra nada: nunca se inventan flyers de ejemplo.
 */
export default function AdvertisingAlbum() {
  const { items } = useCollection('advertising', {
    published: true,
    order: ['orden', 'asc'],
    fallback: [],
  })

  const ads = items.filter(
    (item) => (item.ubicacion || 'inicio') === 'inicio' && item.imagen,
  )

  const [index, setIndex] = useState(null)

  if (ads.length === 0) return null

  const gallery = ads.map((ad) => ({
    imagen: ad.imagen,
    titulo: ad.titulo,
    descripcion: ad.texto || ad.etiqueta || '',
  }))

  return (
    <section className="grain relative overflow-hidden bg-forest py-20 sm:py-24" aria-label="Publicidad de la semana">
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -top-24 -right-16 h-72 w-72 rounded-full bg-terracotta/25 blur-3xl"
      />
      <div
        aria-hidden="true"
        className="pointer-events-none absolute bottom-0 left-0 h-64 w-64 rounded-full bg-mist/20 blur-3xl"
      />

      <div className="shell relative">
        <div className="flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
          <div>
            <Reveal as="p" className="eyebrow flex items-center gap-3 text-gold" y={10}>
              <span className="h-px w-7 bg-gold/60" />
              Publicidad de la semana
            </Reveal>

            <Reveal
              as="h2"
              className="display mt-5 max-w-[20ch] text-[clamp(2rem,4.4vw,3.8rem)] text-bone"
              delay={0.05}
            >
              El álbum de la <em className="text-gold italic">semana</em>.
            </Reveal>
          </div>

          <Reveal
            as="p"
            className="max-w-sm text-sm leading-relaxed text-bone/70"
            delay={0.1}
          >
            Anuncios, flyers y actividades que la iglesia publica cada semana. Toca una
            lámina para verla completa.
          </Reveal>
        </div>

        <div className="mt-12 grid gap-x-6 gap-y-10 sm:grid-cols-2 lg:grid-cols-3">
          {ads.map((ad, position) => {
            const tilt = [-1.6, 1.1, -0.7, 1.4, -1.1, 0.8][position % 6]
            const hasLink = Boolean(ad.enlace)

            return (
              <Reveal key={ad.id} delay={position * 0.06} y={26}>
                <article
                  className="group relative bg-bone p-2.5 pb-5 shadow-[0_24px_50px_-24px_rgba(0,0,0,0.65)] transition-transform duration-500 ease-out hover:rotate-0 hover:-translate-y-1.5"
                  style={{ transform: `rotate(${tilt}deg)` }}
                >
                  <span
                    aria-hidden="true"
                    className={`absolute -top-2.5 left-1/2 h-5 w-16 -translate-x-1/2 -rotate-2 shadow-sm ${
                      position % 2 === 0 ? 'bg-sand/80' : 'bg-mist/60'
                    }`}
                  />

                  <button
                    type="button"
                    onClick={() => setIndex(position)}
                    className="relative block w-full overflow-hidden text-left"
                    aria-label={`Ver ${ad.titulo}`}
                  >
                    <img
                      src={ad.imagen}
                      alt={ad.titulo}
                      loading={position < 3 ? 'eager' : 'lazy'}
                      decoding="async"
                      className="aspect-[4/5] w-full object-cover transition duration-700 group-hover:scale-[1.03]"
                    />
                    <span className="absolute inset-0 bg-gradient-to-t from-ink/80 via-transparent to-transparent opacity-70 transition group-hover:opacity-90" />

                    {ad.etiqueta && (
                      <span className="absolute top-3 left-3 bg-ink/80 px-2.5 py-1 font-mono text-[0.52rem] uppercase tracking-[0.18em] text-gold backdrop-blur-sm">
                        {ad.etiqueta}
                      </span>
                    )}

                    <span className="absolute right-3 bottom-3 grid h-9 w-9 place-items-center rounded-full border border-bone/40 bg-ink/60 text-bone opacity-0 backdrop-blur-sm transition group-hover:opacity-100">
                      <Icon name="external" size={14} />
                    </span>
                  </button>

                  <div className="px-1.5 pt-4">
                    <h3 className="font-display text-[1.35rem] leading-snug text-ink">
                      {ad.titulo}
                    </h3>
                    {ad.texto && (
                      <p className="mt-1.5 line-clamp-2 text-[0.78rem] leading-relaxed text-ink/60">
                        {ad.texto}
                      </p>
                    )}
                    {hasLink && (
                      <a
                        href={ad.enlace}
                        target={ad.enlace.startsWith('http') ? '_blank' : undefined}
                        rel={ad.enlace.startsWith('http') ? 'noreferrer noopener' : undefined}
                        className="mt-3 inline-flex items-center gap-2 font-mono text-[0.55rem] uppercase tracking-[0.18em] text-pine transition hover:text-ink"
                      >
                        Más información
                        <Icon name="arrow-up-right" size={12} />
                      </a>
                    )}
                  </div>
                </article>
              </Reveal>
            )
          })}
        </div>

        <Reveal className="mt-12 flex flex-col items-start justify-between gap-4 border-t border-bone/15 pt-6 sm:flex-row sm:items-center">
          <p className="text-sm text-bone/55">
            ¿Tu ministerio tiene una actividad para anunciar? Compártela con la
            administración de la iglesia.
          </p>
          <Link
            to="/contacto"
            className="inline-flex items-center gap-2 font-mono text-[0.6rem] uppercase tracking-[0.2em] text-gold transition hover:text-bone"
          >
            Enviar una actividad
            <Icon name="arrow-right" size={14} />
          </Link>
        </Reveal>
      </div>

      <Lightbox
        items={gallery}
        index={index}
        onClose={() => setIndex(null)}
        onNavigate={setIndex}
      />
    </section>
  )
}
