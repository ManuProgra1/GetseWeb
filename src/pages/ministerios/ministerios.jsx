import { Link } from 'react-router-dom'
import PageHero from '../../components/common/page-hero'
import Reveal from '../../components/common/reveal'
import ContactCTA from '../../components/sections/contact-cta'
import { useCollection } from '../../hooks/use-collection'
import { DEFAULT_MINISTRIES } from '../../data/content'
import { initials } from '../../utils/misc'
import { Icon } from '../../components/common/icons'

export default function Ministerios() {
  const { items, loading } = useCollection('ministries', {
    published: true,
    order: ['orden', 'asc'],
    fallback: DEFAULT_MINISTRIES,
  })

  return (
    <>
      <PageHero
        eyebrow="Ministerios"
        title={
          <>
            Un lugar para <em className="text-gold italic">servir</em>
          </>
        }
        lead="Cada ministerio tiene su propia identidad, su propio ritmo y una misma misión: amar a Dios y servir a las personas."
        image="images/horizontal/horizontal-orando.jpg"
        imageAlt="Congregación orando durante una reunión"
        meta={[
          { label: 'Ministerios activos', value: String(items.length) },
          { label: 'Cómo sumarte', value: 'Conversa con nosotros' },
        ]}
      />

      <section className="bg-bone py-16 text-ink sm:py-24">
        <div className="shell">
          {loading && items.length === 0 ? (
            <div className="grid gap-5 md:grid-cols-2">
              {[0, 1, 2, 3].map((item) => (
                <div key={item} className="h-72 animate-pulse bg-ink/5" />
              ))}
            </div>
          ) : (
            <div className="grid gap-5 md:grid-cols-2">
              {items.map((ministry, index) => {
                const slug = ministry.slug || ministry.id
                const accent = ministry.acento || '#e6c9a1'
                const mark = ministry.logo

                return (
                  <Reveal key={ministry.id || ministry.nombre} delay={index * 0.05} y={22}>
                    <Link
                      to={`/ministerios/${slug}`}
                      className="group relative flex h-full flex-col justify-between overflow-hidden border border-ink/10 bg-[#faf7ea] p-7 transition-all duration-500 hover:-translate-y-1 hover:border-ink/20 hover:shadow-[0_24px_60px_-30px_rgba(22,32,28,0.45)] sm:p-9"
                    >
                      <div
                        aria-hidden="true"
                        className="pointer-events-none absolute inset-0 opacity-0 transition-opacity duration-700 group-hover:opacity-100"
                        style={{
                          background: `radial-gradient(110% 90% at 100% 0%, ${accent}26, transparent 62%)`,
                        }}
                      />
                      <div
                        aria-hidden="true"
                        className="absolute inset-x-0 top-0 h-px origin-left scale-x-0 transition-transform duration-700 group-hover:scale-x-100"
                        style={{ backgroundColor: accent }}
                      />

                      <div className="relative">
                        <div className="flex items-start justify-between gap-4">
                          <span className="font-mono text-[0.58rem] tracking-[0.2em] text-ink/35">
                            {String(index + 1).padStart(2, '0')}
                          </span>

                          <span
                            className="grid h-16 w-16 place-items-center overflow-hidden rounded-full ring-1 transition duration-500 group-hover:scale-105"
                            style={{
                              backgroundColor: `${accent}1f`,
                              borderColor: `${accent}33`,
                              boxShadow: `inset 0 0 0 1px ${accent}2a`,
                            }}
                          >
                            {mark ? (
                              <img
                                src={mark}
                                alt=""
                                loading="lazy"
                                className="h-full w-full object-cover"
                              />
                            ) : (
                              <span
                                className="font-display text-2xl"
                                style={{ color: accent }}
                              >
                                {initials(ministry.nombre)}
                              </span>
                            )}
                          </span>
                        </div>

                        <div className="mt-8 flex flex-wrap items-center gap-3">
                          <h2 className="font-display text-[clamp(2rem,3.4vw,2.9rem)] leading-none">
                            {ministry.nombre}
                          </h2>
                          {ministry.pendiente && (
                            <span className="border border-ink/20 px-2 py-0.5 font-mono text-[0.48rem] uppercase tracking-[0.16em] text-ink/45">
                              Descripción en proceso
                            </span>
                          )}
                        </div>

                        {ministry.lema && (
                          <p
                            className="mt-3 font-mono text-[0.6rem] uppercase tracking-[0.16em]"
                            style={{ color: accent }}
                          >
                            {ministry.lema}
                          </p>
                        )}

                        <p className="mt-4 line-clamp-3 max-w-md text-sm leading-relaxed text-ink/70">
                          {ministry.descripcion}
                        </p>
                      </div>

                      <div className="relative mt-8 flex items-center justify-between border-t border-ink/10 pt-5">
                        <span className="inline-flex items-center gap-2 text-[0.68rem] font-medium tracking-[0.14em] text-ink/70 uppercase transition group-hover:text-ink">
                          Conocer más
                          <Icon
                            name="arrow-right"
                            size={14}
                            className="transition-transform duration-500 group-hover:translate-x-1"
                          />
                        </span>
                        <span
                          className="h-1.5 w-1.5 rounded-full transition-transform duration-500 group-hover:scale-150"
                          style={{ backgroundColor: accent }}
                        />
                      </div>
                    </Link>
                  </Reveal>
                )
              })}
            </div>
          )}

          <Reveal className="mt-14 flex flex-col items-start justify-between gap-5 border-t border-ink/15 pt-8 sm:flex-row sm:items-center">
            <p className="max-w-xl text-sm leading-relaxed text-ink/70">
              No necesitas experiencia ni un don extraordinario para comenzar. Necesitas
              disponibilidad y ganas de servir.
            </p>
            <Link
              to="/contacto"
              className="inline-flex items-center gap-2 font-mono text-[0.62rem] uppercase tracking-[0.2em] text-pine"
            >
              Quiero servir <Icon name="arrow-up-right" size={14} />
            </Link>
          </Reveal>
        </div>
      </section>

      <ContactCTA />
    </>
  )
}
