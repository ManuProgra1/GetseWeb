import SplitHeading from '../common/split-heading'
import Reveal from '../common/reveal'
import { useSettings } from '../../context/settings-context'

const WORDS = ['Fe', 'Esperanza', 'Unidad', 'Servicio', 'Adoración', 'Comunidad']

function Marquee() {
  const sequence = [...WORDS, ...WORDS, ...WORDS]
  return (
    <div className="marquee border-y border-bone/15 py-5">
      <div className="marquee-track items-center gap-10">
        {[0, 1].map((copy) => (
          <div key={copy} className="flex items-center gap-10" aria-hidden={copy === 1}>
            {sequence.map((word, index) => (
              <span key={`${copy}-${word}-${index}`} className="flex items-center gap-10">
                <span className="font-display text-[clamp(1.6rem,3vw,2.6rem)] text-bone/55">
                  {word}
                </span>
                <span className="text-gold">✦</span>
              </span>
            ))}
          </div>
        ))}
      </div>
    </div>
  )
}

export default function ServiceTimes() {
  const { settings } = useSettings()

  return (
    <section className="relative overflow-hidden bg-forest">
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 bg-[radial-gradient(75%_65%_at_12%_0%,rgba(230,201,161,0.18),transparent_62%)]"
      />
      <div className="relative">
        <Marquee />
      </div>

      <div className="shell relative py-16 sm:py-24">
        <div className="grid gap-6 lg:grid-cols-[1fr_auto] lg:items-end">
          <div>
            <Reveal as="p" className="eyebrow text-sand" y={10}>
              Nuestras reuniones
            </Reveal>
            <SplitHeading
              as="h2"
              className="display mt-4 max-w-[18ch] text-[clamp(2rem,4.4vw,3.6rem)] text-bone"
            >
              Horarios de la <em className="text-sand italic">semana</em>
            </SplitHeading>
          </div>
          <Reveal as="p" className="max-w-sm text-sm leading-relaxed text-bone/75" delay={0.08}>
            El lunes no hay reunión. Los demás días abrimos las puertas para orar, aprender y
            adorar juntos. Si es tu primera vez, te esperamos.
          </Reveal>
        </div>

        <div className="mt-12 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {settings.horarios.map((item, index) => (
            <Reveal
              key={`${item.dia}-${item.hora}`}
              delay={0.05 * index}
              className="group border border-bone/15 bg-ink/25 p-5 transition-colors duration-500 hover:border-sand/60 hover:bg-ink/40"
            >
              <div className="flex items-baseline justify-between gap-3">
                <p className="font-display text-2xl text-bone sm:text-[1.7rem]">{item.dia}</p>
                <span className="font-mono text-[0.55rem] text-bone/40">
                  {String(index + 1).padStart(2, '0')}
                </span>
              </div>

              <p className="mt-3 inline-flex bg-sand/20 px-3 py-1 font-mono text-[0.68rem] tracking-[0.06em] text-sand">
                {item.hora}
              </p>

              {item.detalle && (
                <p className="mt-3 text-xs leading-relaxed text-bone/65">{item.detalle}</p>
              )}
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  )
}
