import { useMemo } from 'react'
import PageHero from '../../components/common/page-hero'
import Reveal from '../../components/common/reveal'
import ParallaxImage from '../../components/common/parallax-image'
import ContactCTA from '../../components/sections/contact-cta'
import Button from '../../components/common/button'
import { Icon } from '../../components/common/icons'
import { useScene } from '../../animations/use-scene'
import { gsap } from '../../animations/register'
import { useReducedMotion } from '../../hooks/use-reduced-motion'
import { useCollection } from '../../hooks/use-collection'
import { DEFAULT_HISTORY, HISTORY_NOTE, HISTORY_SOURCE } from '../../data/content'

export default function Historia() {
  const reduced = useReducedMotion()
  const { items: entries, loading } = useCollection('history', {
    published: true,
    order: ['orden', 'asc'],
    fallback: DEFAULT_HISTORY,
  })

  const { items: gallery } = useCollection('gallery', {
    order: ['fecha', 'desc'],
    fallback: [],
  })

  const historyGallery = useMemo(
    () => gallery.filter((item) => (item.ministerio || '').toLowerCase().includes('historia')),
    [gallery],
  )

  const scope = useScene(
    (section) => {
      if (reduced) return

      const track = section.querySelector('[data-track]')
      const progress = section.querySelector('[data-progress]')

      if (track && progress) {
        gsap.fromTo(
          progress,
          { scaleY: 0 },
          {
            scaleY: 1,
            ease: 'none',
            scrollTrigger: {
              trigger: track,
              start: 'top 72%',
              end: 'bottom 78%',
              scrub: 0.5,
            },
          },
        )
      }

      section.querySelectorAll('[data-entry]').forEach((entry) => {
        gsap.fromTo(
          entry,
          { opacity: 0, y: 38 },
          {
            opacity: 1,
            y: 0,
            duration: 1,
            ease: 'power3.out',
            scrollTrigger: { trigger: entry, start: 'top 88%', once: true },
          },
        )
      })
    },
    [reduced, entries.length],
  )

  return (
    <>
      <PageHero
        eyebrow="Nuestra historia"
        title={
          <>
            Una historia que se está <em className="text-gold italic">documentando</em>
          </>
        }
        lead="La fidelidad de Dios en la vida de nuestra congregación, contada con fe y con rigor: solo publicamos lo que podemos verificar."
        image="images/horizontal/horizontal-predica.jpg"
        imageAlt="Predicación durante un culto de la iglesia"
        meta={[
          { label: 'Archivo', value: 'Documentación en curso' },
          { label: 'Fuente', value: 'Material oficial de la iglesia' },
          { label: 'Última revisión', value: '2026' },
        ]}
      />

      <section className="bg-bone py-16 text-ink sm:py-20">
        <div className="shell grid gap-8 lg:grid-cols-[0.35fr_0.65fr] lg:gap-16">
          <Reveal as="p" className="eyebrow text-pine">
            Nota de archivo
          </Reveal>
          <div>
            <Reveal as="p" className="max-w-2xl font-display text-2xl leading-tight sm:text-3xl">
              {HISTORY_NOTE}
            </Reveal>
            <Reveal className="mt-6 flex flex-wrap items-center gap-4 text-sm text-ink/65" delay={0.1}>
              <a
                href={HISTORY_SOURCE.url}
                target="_blank"
                rel="noreferrer noopener"
                className="inline-flex items-center gap-2 border-b border-ink/25 pb-1 transition hover:border-ink hover:text-ink"
              >
                <Icon name="facebook" size={15} />
                {HISTORY_SOURCE.label}
                <Icon name="external" size={13} />
              </a>
              <span className="text-ink/30">·</span>
              <span>Contenido ampliable desde el panel administrativo</span>
            </Reveal>
          </div>
        </div>
      </section>

      <section ref={scope} className="bg-ink py-20 sm:py-28">
        <div className="shell">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <Reveal as="p" className="eyebrow text-gold/80" y={10}>
                Línea de tiempo
              </Reveal>
              <Reveal
                as="h2"
                className="display mt-4 text-[clamp(2rem,4.6vw,3.8rem)] text-bone"
                delay={0.05}
              >
                Capítulos de nuestra <em className="italic text-gold">memoria</em>
              </Reveal>
            </div>
            <Reveal as="p" className="max-w-sm text-sm text-bone/45" delay={0.1}>
              Cada entrada se publica con fecha, fotografía y contexto verificable.
            </Reveal>
          </div>

          <div data-track className="relative mt-16">
            <span
              aria-hidden="true"
              className="absolute top-0 bottom-0 left-[3px] w-px bg-bone/15 sm:left-[9.5rem]"
            />
            <span
              data-progress
              aria-hidden="true"
              className="absolute top-0 bottom-0 left-[3px] w-px origin-top bg-gold/80 sm:left-[9.5rem]"
            />

            {loading && entries.length === 0 && (
              <div className="py-10 pl-8 text-sm text-bone/40">Cargando historia…</div>
            )}

            {entries.map((entry) => (
              <article
                key={entry.id || entry.titulo}
                data-entry
                className="relative grid gap-5 border-t border-bone/10 py-12 pl-8 sm:grid-cols-[8rem_1fr] sm:gap-12 sm:py-16 sm:pl-0"
              >
                <span
                  aria-hidden="true"
                  className="absolute top-[3.35rem] left-[3px] h-1.5 w-1.5 -translate-x-1/2 rounded-full bg-gold sm:top-[4.35rem] sm:left-[9.5rem]"
                />

                <div>
                  <p className="font-mono text-[0.62rem] uppercase tracking-[0.2em] text-gold/85">
                    {entry.fecha || 'Por documentar'}
                  </p>
                  {entry.categoria && (
                    <p className="mt-2 text-[0.7rem] text-bone/35">{entry.categoria}</p>
                  )}
                </div>

                <div className="grid gap-8 lg:grid-cols-[1.15fr_0.85fr]">
                  <div>
                    <div className="flex flex-wrap items-center gap-3">
                      <h3 className="font-display text-[clamp(1.7rem,3vw,2.6rem)] text-bone">
                        {entry.titulo}
                      </h3>
                      {entry.pendiente && (
                        <span className="border border-gold/30 px-2 py-0.5 font-mono text-[0.5rem] uppercase tracking-[0.16em] text-gold/80">
                          En verificación
                        </span>
                      )}
                    </div>
                    <p className="mt-4 max-w-xl text-sm leading-relaxed text-bone/55">
                      {entry.descripcion}
                    </p>
                  </div>

                  {entry.imagen && (
                    <ParallaxImage
                      src={entry.imagen}
                      alt={entry.titulo}
                      className="aspect-[4/3] w-full"
                      strength={5}
                    />
                  )}
                </div>
              </article>
            ))}
          </div>

          <Reveal className="mt-14 flex flex-col gap-4 border-t border-bone/10 pt-8 sm:flex-row sm:items-center sm:justify-between">
            <p className="max-w-lg text-sm text-bone/40">
              ¿Tienes fotografías, documentos o un testimonio que ayude a reconstruir nuestra
              historia? Nos encantaría escucharte.
            </p>
            <Button to="/contacto" variant="outline" size="sm" icon="arrow-up-right">
              Compartir información
            </Button>
          </Reveal>
        </div>
      </section>

      {historyGallery.length > 0 && (
        <section className="bg-bone py-20 text-ink sm:py-24">
          <div className="shell">
            <Reveal as="p" className="eyebrow text-pine">
              Archivo fotográfico
            </Reveal>
            <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {historyGallery.map((item, index) => (
                <Reveal key={item.id} delay={index * 0.05} className="group overflow-hidden">
                  <img
                    src={item.imagen}
                    alt={item.titulo || 'Fotografía histórica'}
                    loading="lazy"
                    className="aspect-[4/3] w-full object-cover transition duration-700 group-hover:scale-[1.03]"
                  />
                  {item.titulo && (
                    <p className="mt-3 text-sm text-ink/60">{item.titulo}</p>
                  )}
                </Reveal>
              ))}
            </div>
          </div>
        </section>
      )}

      <ContactCTA />
    </>
  )
}
