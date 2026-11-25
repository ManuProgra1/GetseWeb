import { useEffect, useMemo, useRef, useState } from 'react'
import { createPortal } from 'react-dom'
import { Link } from 'react-router-dom'
import PageHero from '../../components/common/page-hero'
import EventCard from '../../components/sections/event-card'
import Reveal from '../../components/common/reveal'
import Button from '../../components/common/button'
import { Icon } from '../../components/common/icons'
import ContactCTA from '../../components/sections/contact-cta'
import AdBanner from '../../components/sections/ad-banner'
import { useCollection } from '../../hooks/use-collection'
import { DEFAULT_EVENTS } from '../../data/content'
import { formatFullDate, isUpcoming } from '../../utils/dates'

function EventDialog({ event, onClose }) {
  const closeRef = useRef(null)

  useEffect(() => {
    document.documentElement.style.overflow = 'hidden'
    closeRef.current?.focus()
    const onKey = (keyEvent) => {
      if (keyEvent.key === 'Escape') onClose()
    }
    window.addEventListener('keydown', onKey)
    return () => {
      window.removeEventListener('keydown', onKey)
      document.documentElement.style.overflow = ''
    }
  }, [onClose])

  return createPortal(
    <div
      className="fixed inset-0 z-[500] flex items-center justify-center bg-ink/85 p-4 backdrop-blur-md sm:p-8"
      role="dialog"
      aria-modal="true"
      aria-label={event.titulo}
      onMouseDown={(mouseEvent) => {
        if (mouseEvent.target === mouseEvent.currentTarget) onClose()
      }}
    >
      <div className="relative max-h-[90svh] w-full max-w-3xl overflow-y-auto border border-bone/15 bg-night">
        <button
          ref={closeRef}
          type="button"
          onClick={onClose}
          aria-label="Cerrar"
          className="absolute top-4 right-4 z-10 grid h-10 w-10 place-items-center rounded-full border border-bone/25 bg-ink/70 text-bone backdrop-blur-md transition hover:border-gold/60 hover:text-gold"
        >
          <Icon name="close" size={17} />
        </button>

        {event.imagen && (
          <div className="relative aspect-[16/9] overflow-hidden">
            <img
              src={event.imagen}
              alt={event.titulo}
              className="h-full w-full object-cover"
              style={{ objectPosition: event.imagenPosicion || 'center 42%' }}
            />
            <div className="absolute inset-0 bg-gradient-to-t from-night via-night/20 to-transparent" />
          </div>
        )}

        <div className="p-6 sm:p-9">
          {event.categoria && (
            <span className="font-mono text-[0.58rem] uppercase tracking-[0.22em] text-gold">
              {event.categoria}
            </span>
          )}
          <h2 className="mt-3 font-display text-[clamp(1.8rem,4vw,2.8rem)] leading-tight text-bone">
            {event.titulo}
          </h2>

          <div className="mt-6 grid gap-4 border-t border-bone/10 pt-5 text-sm text-bone/65 sm:grid-cols-3">
            <div>
              <p className="font-mono text-[0.55rem] uppercase tracking-[0.18em] text-bone/35">
                Fecha
              </p>
              <p className="mt-1 first-letter:uppercase">{formatFullDate(event.fecha)}</p>
            </div>
            <div>
              <p className="font-mono text-[0.55rem] uppercase tracking-[0.18em] text-bone/35">
                Hora
              </p>
              <p className="mt-1">{event.hora || 'Por confirmar'}</p>
            </div>
            <div>
              <p className="font-mono text-[0.55rem] uppercase tracking-[0.18em] text-bone/35">
                Lugar
              </p>
              <p className="mt-1">{event.ubicacion || 'Por confirmar'}</p>
            </div>
          </div>

          {event.descripcion && (
            <p className="mt-6 text-sm leading-relaxed whitespace-pre-line text-bone/60">
              {event.descripcion}
            </p>
          )}

          <div className="mt-8 flex flex-wrap gap-3">
            <Button to="/contacto" size="sm" onClick={onClose}>
              Más información
            </Button>
            <Button variant="outline" size="sm" onClick={onClose} icon="close">
              Cerrar
            </Button>
          </div>
        </div>
      </div>
    </div>,
    document.body,
  )
}

export default function Eventos() {
  const { items, loading } = useCollection('events', {
    published: true,
    order: ['fecha', 'asc'],
    fallback: DEFAULT_EVENTS,
  })
  const [category, setCategory] = useState('Todos')
  const [selected, setSelected] = useState(null)

  const categories = useMemo(() => {
    const found = [...new Set(items.map((item) => item.categoria).filter(Boolean))]
    return ['Todos', ...found]
  }, [items])

  const upcoming = useMemo(
    () => items.filter((item) => isUpcoming(item.fecha)),
    [items],
  )

  const past = useMemo(
    () => items.filter((item) => !isUpcoming(item.fecha)).reverse(),
    [items],
  )

  const filtered = category === 'Todos'
    ? upcoming
    : upcoming.filter((item) => item.categoria === category)

  return (
    <>
      <PageHero
        eyebrow="Agenda"
        title={
          <>
            Todo lo que viene en <em className="text-gold italic">Getsemaní</em>
          </>
        }
        lead="Conferencias, campañas, vigilias y actividades especiales de nuestros ministerios. Los cultos y reuniones de cada semana están en los horarios de la iglesia."
        image="images/horizontal/horizontal-alabanza.jpg"
        imageAlt="Equipo de alabanza sirviendo durante un culto"
        meta={[
          { label: 'Agenda', value: 'Actividades especiales y de ministerios' },
          { label: 'Entrada', value: 'Abierta a toda la comunidad' },
        ]}
      />

      <section className="bg-ink py-16 sm:py-24">
        <div className="shell">
          <div className="no-scrollbar -mx-1 flex gap-2 overflow-x-auto px-1 pb-1">
            {categories.map((item) => (
              <button
                key={item}
                type="button"
                onClick={() => setCategory(item)}
                className={`shrink-0 rounded-full border px-5 py-2.5 font-mono text-[0.6rem] uppercase tracking-[0.18em] transition ${
                  category === item
                    ? 'border-gold bg-gold text-ink'
                    : 'border-bone/15 text-bone/60 hover:border-bone/40 hover:text-bone'
                }`}
              >
                {item}
              </button>
            ))}
          </div>

          <div className="mt-10 flex items-end justify-between gap-6">
            <p className="font-mono text-[0.6rem] uppercase tracking-[0.22em] text-bone/35">
              Próximas actividades · {filtered.length}
            </p>
          </div>

          {loading && filtered.length === 0 ? (
            <div className="mt-8 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
              {[0, 1, 2].map((item) => (
                <div key={item} className="h-80 animate-pulse border border-bone/10 bg-white/[0.03]" />
              ))}
            </div>
          ) : filtered.length > 0 ? (
            <div className="mt-8 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
              {filtered.map((event, index) => (
                <Reveal key={event.id || `${event.titulo}-${index}`} delay={index * 0.05} y={22}>
                  <EventCard event={event} index={index} onClick={() => setSelected(event)} />
                </Reveal>
              ))}
            </div>
          ) : (
            <div className="mt-8 border border-bone/10 px-8 py-16 text-center">
              <p className="font-display text-2xl text-bone/75">
                No hay actividades publicadas en esta categoría.
              </p>
              <p className="mt-3 text-sm text-bone/45">
                Vuelve pronto o escríbenos para conocer las actividades de nuestros ministerios.
              </p>
              <div className="mt-7 flex justify-center">
                <Button to="/contacto" variant="outline" size="sm">
                  Preguntar por la agenda
                </Button>
              </div>
            </div>
          )}

          {past.length > 0 && (
            <div className="mt-20 border-t border-bone/10 pt-12">
              <Reveal as="p" className="eyebrow text-bone/35">
                Actividades realizadas
              </Reveal>
              <div className="mt-8 space-y-2">
                {past.slice(0, 6).map((event) => (
                  <button
                    key={event.id}
                    type="button"
                    onClick={() => setSelected(event)}
                    className="group flex w-full flex-wrap items-center justify-between gap-4 border-b border-bone/10 py-4 text-left transition hover:border-gold/40"
                  >
                    <div>
                      <p className="font-display text-xl text-bone/80 transition group-hover:text-gold">
                        {event.titulo}
                      </p>
                      <p className="mt-1 text-xs text-bone/35">
                        {formatFullDate(event.fecha)} · {event.hora}
                      </p>
                    </div>
                    <Icon
                      name="arrow-up-right"
                      size={15}
                      className="text-bone/30 transition group-hover:text-gold"
                    />
                  </button>
                ))}
              </div>
            </div>
          )}

          <Reveal className="mt-14 flex flex-col items-start justify-between gap-4 border-t border-bone/10 pt-8 sm:flex-row sm:items-center">
            <p className="text-sm text-bone/45">
              ¿Organizas una actividad para tu ministerio? Compártela con la administración
              de la iglesia.
            </p>
            <Link
              to="/contacto"
              className="inline-flex items-center gap-2 font-mono text-[0.6rem] uppercase tracking-[0.2em] text-gold"
            >
              Solicitar publicación <Icon name="arrow-right" size={14} />
            </Link>
          </Reveal>
        </div>
      </section>

      <AdBanner placement="eventos" />

      <ContactCTA />

      {selected && <EventDialog event={selected} onClose={() => setSelected(null)} />}
    </>
  )
}
