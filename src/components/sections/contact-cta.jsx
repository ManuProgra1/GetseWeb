import SplitHeading from '../common/split-heading'
import Reveal from '../common/reveal'
import Button from '../common/button'
import { Icon } from '../common/icons'
import { useSettings } from '../../context/settings-context'

export default function ContactCTA() {
  const { settings } = useSettings()

  return (
    <section className="grain relative overflow-hidden bg-forest py-24 sm:py-32">
      <div className="absolute inset-0 -z-10 bg-[radial-gradient(70%_75%_at_50%_100%,rgba(230,201,161,0.26),transparent_72%)]" />
      <div className="absolute inset-0 -z-10 bg-[radial-gradient(60%_60%_at_10%_0%,rgba(84,121,114,0.55),transparent_65%)]" />
      <div className="shell text-center">
        <Reveal as="p" className="eyebrow text-gold/80" y={10}>
          Te esperamos
        </Reveal>

        <SplitHeading
          as="h2"
          className="display mx-auto mt-6 max-w-[22ch] text-[clamp(2.3rem,6vw,5.4rem)] text-bone"
        >
          ¿Nos visitas <em className="italic text-gold">este domingo</em>?
        </SplitHeading>

        <Reveal as="p" className="mx-auto mt-6 max-w-md text-sm leading-relaxed text-bone/75 sm:text-base">
          No necesitas tener todo resuelto para venir. Hay un lugar para ti, para tu familia
          y para tus preguntas.
        </Reveal>

        <Reveal className="mt-10 flex flex-wrap justify-center gap-3" delay={0.12}>
          <Button to="/contacto" size="lg">
            Cómo llegar
          </Button>
          <Button to="/ministerios" variant="outline" size="lg" icon="arrow-up-right">
            Quiero servir
          </Button>
        </Reveal>

        <Reveal
          className="mx-auto mt-12 flex flex-wrap items-center justify-center gap-x-8 gap-y-3 border-t border-bone/15 pt-8 text-[0.7rem] text-bone/60"
          delay={0.18}
        >
          {settings.horarios
            .filter((item) => item.dia === 'Domingo')
            .map((item) => (
              <span
                key={`${item.dia}-${item.hora}`}
                className="inline-flex items-center gap-2"
              >
                <Icon name="clock" size={13} className="text-gold/60" />
                <span className="text-bone/90">{item.dia}</span> {item.hora}
              </span>
            ))}
          {settings.direccion && (
            <span className="inline-flex items-center gap-2">
              <Icon name="map-pin" size={13} className="text-gold/60" />
              {settings.direccion}
            </span>
          )}
        </Reveal>
      </div>
    </section>
  )
}
