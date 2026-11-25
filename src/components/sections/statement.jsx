import { Link } from 'react-router-dom'
import SplitHeading from '../common/split-heading'
import Reveal from '../common/reveal'
import { Icon } from '../common/icons'

const VALUES = [
  { title: 'Fe', text: 'Creemos en Dios y en el poder transformador de su Palabra.' },
  { title: 'Esperanza', text: 'Caminamos con la certeza de que Cristo hace nuevas todas las cosas.' },
  { title: 'Comunidad', text: 'Nos sostenemos unos a otros, como una sola familia.' },
]

export default function Statement() {
  return (
    <section className="relative overflow-hidden bg-bone py-20 text-ink sm:py-28">
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-x-0 top-0 h-1 bg-gradient-to-r from-pine via-sage to-sand"
      />

      <div className="shell">
        <div className="grid gap-12 lg:grid-cols-[0.62fr_1.38fr] lg:gap-20">
          <div className="flex flex-col justify-between gap-10">
            <div>
              <Reveal as="p" className="eyebrow flex items-center gap-3 text-pine" y={10}>
                <span className="h-px w-7 bg-pine/60" />
                Quiénes somos
              </Reveal>
              <p className="mt-8 max-w-[16rem] font-display text-2xl leading-tight text-ink/80">
                Una comunidad que cree en la fidelidad de Dios y en el valor de cada persona.
              </p>
            </div>

            <Link
              to="/nosotros"
              className="group inline-flex items-center gap-3 font-mono text-[0.62rem] uppercase tracking-[0.24em] text-pine transition hover:text-forest"
            >
              Conoce nuestra identidad
              <span className="grid h-8 w-8 place-items-center rounded-full border border-pine/40 transition group-hover:border-pine group-hover:bg-pine group-hover:text-bone">
                <Icon name="arrow-up-right" size={14} />
              </span>
            </Link>
          </div>

          <div>
            <SplitHeading
              as="h2"
              className="display max-w-[20ch] text-[clamp(2.1rem,4.8vw,4.6rem)] text-ink"
            >
              Una iglesia de relación, <em className="text-olive italic">no religión</em>.
            </SplitHeading>

            <div className="mt-10 grid gap-6 sm:grid-cols-2">
              <Reveal as="p" className="text-sm leading-relaxed text-ink/70 sm:text-base" delay={0.05}>
                Somos una iglesia cristiana evangélica comprometida con proclamar el amor
                incondicional de Dios. Buscamos ser un lugar de refugio, esperanza y
                transformación para todos los que nos visitan.
              </Reveal>
              <Reveal as="p" className="text-sm leading-relaxed text-ink/70 sm:text-base" delay={0.12}>
                La iglesia no es un edificio, sino una familia de creyentes unidos por el amor
                de Cristo. Aquí hay espacio para preguntar, para sanar y para comenzar de nuevo.
              </Reveal>
            </div>

            <div className="mt-12 grid gap-4 sm:grid-cols-3">
              {VALUES.map((value, index) => (
                <Reveal
                  key={value.title}
                  delay={0.08 * index}
                  y={18}
                  className="group border border-pine/15 bg-sage/15 p-5 transition-colors duration-500 hover:border-pine/40 hover:bg-sage/25"
                >
                  <p className="flex items-baseline gap-2">
                    <span className="font-mono text-[0.6rem] text-pine/70">
                      0{index + 1}
                    </span>
                    <span className="font-display text-2xl text-ink">{value.title}</span>
                  </p>
                  <p className="mt-2 text-xs leading-relaxed text-ink/65">{value.text}</p>
                </Reveal>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
