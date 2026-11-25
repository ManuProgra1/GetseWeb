import ParallaxImage from '../common/parallax-image'
import Reveal from '../common/reveal'
import SplitHeading from '../common/split-heading'
import Button from '../common/button'
import { Icon } from '../common/icons'
import { HISTORY_NOTE } from '../../data/content'

export default function HistoryTeaser() {
  return (
    <section className="bg-bone py-20 text-ink sm:py-28">
      <div className="shell">
        <div className="grid items-center gap-12 lg:grid-cols-2 lg:gap-16">
          <div className="order-2 lg:order-1">
            <Reveal as="p" className="eyebrow flex items-center gap-3 text-pine" y={10}>
              <span className="h-px w-7 bg-pine/60" />
              Nuestra historia
            </Reveal>

            <SplitHeading
              as="h2"
              className="display mt-6 max-w-[18ch] text-[clamp(2rem,4.4vw,3.9rem)] text-ink"
            >
              La fidelidad de Dios, contada <em className="text-olive italic">con cuidado</em>.
            </SplitHeading>

            <Reveal as="p" className="mt-6 max-w-lg text-sm leading-relaxed text-ink/70 sm:text-base">
              {HISTORY_NOTE}
            </Reveal>

            <Reveal className="mt-8 flex flex-col gap-3 text-xs text-ink/60" delay={0.1}>
              <p className="flex items-start gap-3">
                <Icon name="book" size={16} className="mt-0.5 shrink-0 text-olive" />
                Estamos integrando archivos, fotografías y testimonios de la congregación.
              </p>
              <p className="flex items-start gap-3">
                <Icon name="check" size={16} className="mt-0.5 shrink-0 text-olive" />
                Solo publicaremos datos que podamos verificar.
              </p>
            </Reveal>

            <Reveal className="mt-9" delay={0.15}>
              <Button to="/historia" variant="outlineDark" icon="arrow-up-right">
                Recorrer nuestra historia
              </Button>
            </Reveal>
          </div>

          <div className="order-1 lg:order-2">
            <ParallaxImage
              src="images/horizontal/horizontal-predica.jpg"
              alt="Predicación durante una reunión de la iglesia"
              className="aspect-[16/10] w-full"
              strength={5}
            >
              <div className="absolute inset-x-0 bottom-0 z-10 bg-gradient-to-t from-ink via-ink/50 to-transparent p-6 sm:p-8">
                <p className="font-display text-2xl leading-snug text-bone italic sm:text-3xl">
                  “Hasta aquí nos ayudó Jehová.”
                </p>
                <p className="mt-2 font-mono text-[0.55rem] uppercase tracking-[0.24em] text-gold">
                  1 Samuel 7:12
                </p>
              </div>
            </ParallaxImage>
          </div>
        </div>
      </div>
    </section>
  )
}
