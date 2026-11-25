import { Link } from 'react-router-dom'
import { dayNumber, formatFullDate, monthShort } from '../../utils/dates'
import { Icon } from '../common/icons'

export default function EventCard({ event, to, onClick, index = 0 }) {
  const Component = to ? Link : onClick ? 'button' : 'article'
  const props = to
    ? { to }
    : onClick
      ? { type: 'button', onClick }
      : {}

  return (
    <Component
      {...props}
      className={`group block w-full overflow-hidden border border-bone/10 bg-night/40 text-left transition-colors duration-500 hover:border-gold/35 ${
        onClick ? 'cursor-pointer' : ''
      }`}
    >
      <div className="relative aspect-[16/10] overflow-hidden">
        {event.imagen ? (
          <img
            src={event.imagen}
            alt={event.titulo}
            loading={index < 2 ? 'eager' : 'lazy'}
            decoding="async"
            style={{ objectPosition: event.imagenPosicion || 'center 42%' }}
            className="h-full w-full object-cover transition-transform duration-[900ms] ease-out group-hover:scale-[1.05]"
          />
        ) : (
          <div className="flex h-full w-full items-center justify-center bg-gradient-to-br from-moss to-ink">
            <Icon name="calendar" size={34} className="text-gold/40" />
          </div>
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-ink/85 via-transparent to-transparent" />

        <div className="absolute top-4 left-4 flex flex-col items-center border border-bone/15 bg-ink/80 px-3 py-2 backdrop-blur-sm">
          <span className="font-display text-2xl leading-none text-bone">
            {dayNumber(event.fecha)}
          </span>
          <span className="mt-1 font-mono text-[0.55rem] tracking-[0.18em] text-gold/90">
            {monthShort(event.fecha)}
          </span>
        </div>

        {event.categoria && (
          <span className="absolute top-4 right-4 border border-bone/15 bg-ink/60 px-2.5 py-1 font-mono text-[0.52rem] uppercase tracking-[0.16em] text-bone/70 backdrop-blur-sm">
            {event.categoria}
          </span>
        )}
      </div>

      <div className="p-5 sm:p-6">
        <h3 className="font-display text-[clamp(1.35rem,2.2vw,1.9rem)] leading-tight text-bone transition-colors group-hover:text-gold">
          {event.titulo}
        </h3>

        <div className="mt-3 flex flex-wrap gap-x-5 gap-y-1.5 text-[0.7rem] text-bone/45">
          <span className="inline-flex items-center gap-2">
            <Icon name="clock" size={13} className="text-gold/60" />
            {event.hora || 'Hora por confirmar'}
          </span>
          {event.ubicacion && (
            <span className="inline-flex items-center gap-2">
              <Icon name="map-pin" size={13} className="text-gold/60" />
              {event.ubicacion}
            </span>
          )}
        </div>

        {event.descripcion && (
          <p className="mt-4 line-clamp-2 text-sm leading-relaxed text-bone/50">
            {event.descripcion}
          </p>
        )}

        <div className="mt-5 flex items-center justify-between border-t border-bone/10 pt-4">
          <span className="font-mono text-[0.55rem] uppercase tracking-[0.18em] text-bone/30">
            {formatFullDate(event.fecha)}
          </span>
          <Icon
            name="arrow-up-right"
            size={15}
            className="text-bone/40 transition group-hover:translate-x-0.5 group-hover:text-gold"
          />
        </div>
      </div>
    </Component>
  )
}
