import SectionHeading from '../common/section-heading'
import Button from '../common/button'
import EventCard from './event-card'
import Reveal from '../common/reveal'
import { isUpcoming } from '../../utils/dates'

export default function UpcomingEvents({ events, loading }) {
  const upcoming = events.filter((event) => isUpcoming(event.fecha)).slice(0, 3)

  return (
    <section className="bg-ink py-20 sm:py-28">
      <div className="shell">
        <SectionHeading
          eyebrow="Agenda"
          title={
            <>
              Próximos <em className="italic text-gold">encuentros</em>
            </>
          }
          lead="Actividades especiales, conferencias y campañas de nuestros ministerios. Los cultos semanales están en los horarios."
          className="text-bone"
          action={
            <Button to="/eventos" variant="outline" icon="calendar">
              Ver calendario
            </Button>
          }
        />

        <div className="mt-12 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {upcoming.map((event, index) => (
            <Reveal key={event.id || `${event.titulo}-${index}`} delay={index * 0.07} y={24}>
              <EventCard event={event} to="/eventos" index={index} />
            </Reveal>
          ))}

          {!loading && upcoming.length === 0 && (
            <div className="col-span-full border border-bone/10 p-10 text-center">
              <p className="font-display text-2xl text-bone/75">
                Muy pronto publicaremos nuestra próxima actividad especial.
              </p>
              <p className="mt-3 text-sm text-bone/45">
                Mientras tanto, te esperamos en nuestras reuniones semanales.
              </p>
            </div>
          )}

          {loading &&
            upcoming.length === 0 &&
            [0, 1, 2].map((item) => (
              <div
                key={item}
                className="h-80 animate-pulse border border-bone/10 bg-white/[0.03]"
              />
            ))}
        </div>
      </div>
    </section>
  )
}
