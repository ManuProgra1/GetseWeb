import PageHero from '../../components/common/page-hero'
import SplitHeading from '../../components/common/split-heading'
import Reveal from '../../components/common/reveal'
import SectionHeading from '../../components/common/section-heading'
import ParallaxImage from '../../components/common/parallax-image'
import ContactCTA from '../../components/sections/contact-cta'
import Button from '../../components/common/button'
import { Icon } from '../../components/common/icons'
import { CHURCH } from '../../data/content'
import { useSettings } from '../../context/settings-context'

const PILLARS = [
  {
    number: '01',
    title: 'Misión',
    text: 'Proclamar el Evangelio de Jesucristo, edificar una comunidad de creyentes maduros en la fe y servir con excelencia a nuestra ciudad y al mundo.',
    icon: 'sparkle',
  },
  {
    number: '02',
    title: 'Visión',
    text: 'Ser una iglesia que transforma vidas mediante el poder del Evangelio, formando discípulos comprometidos que impacten a Guatemala y a las naciones con el amor de Cristo.',
    icon: 'eye',
  },
  {
    number: '03',
    title: 'Propósito',
    text: 'Adorar a Dios con todo lo que somos, acompañar a las personas en su camino de fe y servir a nuestra comunidad con humildad, esperanza y amor.',
    icon: 'heart',
  },
]

const VALUES = [
  {
    title: 'Amor',
    text: 'Proclamamos y vivimos el amor incondicional de Dios hacia todas las personas.',
    icon: 'heart',
  },
  {
    title: 'Palabra de Dios',
    text: 'Fundamentamos nuestra fe y nuestras enseñanzas en las Sagradas Escrituras.',
    icon: 'book',
  },
  {
    title: 'Servicio',
    text: 'Nos dedicamos a servir a nuestra comunidad con humildad y generosidad.',
    icon: 'users',
  },
  {
    title: 'Comunidad',
    text: 'Fomentamos relaciones auténticas y significativas entre hermanos en la fe.',
    icon: 'sparkle',
  },
]

const BELIEFS = [
  { title: 'La Trinidad', text: 'Creemos en un solo Dios que existe en tres personas: Padre, Hijo y Espíritu Santo.' },
  { title: 'La Biblia', text: 'La Palabra de Dios es inspirada, inerrante y nuestra única regla de fe y conducta.' },
  { title: 'La salvación', text: 'La salvación es por gracia mediante la fe en Jesucristo, no por obras.' },
  { title: 'El bautismo', text: 'El bautismo en agua es un acto de obediencia y un testimonio público de fe.' },
  { title: 'El Espíritu Santo', text: 'El Espíritu Santo nos capacita para vivir una vida cristiana victoriosa.' },
  { title: 'La segunda venida', text: 'Creemos en el regreso visible y glorioso de Jesucristo a la tierra.' },
]

export default function Nosotros() {
  const { settings } = useSettings()

  return (
    <>
      <PageHero
        eyebrow="Nosotros"
        title={
          <>
            Una familia que camina <em className="text-gold italic">en fe</em>
          </>
        }
        lead="Conoce quiénes somos, lo que creemos y el propósito que nos reúne domingo tras domingo."
        image="/images/horizontal/horizontal-congregacion.jpg"
        imageAlt="Congregación de Asambleas de Dios Getsemaní reunida en el templo"
        meta={[
          { label: 'Movimiento', value: CHURCH.movement },
          { label: 'País', value: CHURCH.country },
          { label: 'Lema', value: CHURCH.claim },
        ]}
      />

      <section className="bg-bone py-20 text-ink sm:py-28">
        <div className="shell grid gap-12 lg:grid-cols-[1.1fr_0.9fr] lg:gap-20">
          <div>
            <Reveal as="p" className="eyebrow flex items-center gap-3 text-pine" y={10}>
              <span className="h-px w-7 bg-ink/30" />
              Nuestra identidad
            </Reveal>

            <SplitHeading
              as="h2"
              className="display mt-6 max-w-[20ch] text-[clamp(2rem,4.4vw,3.9rem)]"
            >
              Somos una comunidad cristiana comprometida con el amor de Dios.
            </SplitHeading>

            <div className="mt-8 grid gap-5 text-sm leading-relaxed text-ink/70 sm:grid-cols-2 sm:text-base">
              <Reveal as="p">
                Somos una iglesia cristiana evangélica que proclama el incondicional amor de
                Dios. Nuestra misión es ser una comunidad donde las personas puedan encontrarse
                con Cristo, crecer en su fe y servir con propósito.
              </Reveal>
              <Reveal as="p" delay={0.08}>
                Creemos que la iglesia no es un edificio, sino una familia de creyentes unidos
                por el amor de Cristo. Buscamos ser un lugar de refugio, esperanza y
                transformación para todos los que nos visitan.
              </Reveal>
            </div>

            <Reveal className="mt-10" delay={0.12}>
              <Button to="/historia" variant="outlineDark" icon="history">
                Ver nuestra historia
              </Button>
            </Reveal>

            <Reveal className="mt-10 border-t border-ink/15 pt-8" delay={0.16}>
              <p className="eyebrow text-pine">Nuestros pastores</p>
              <div className="mt-4 flex flex-wrap gap-x-12 gap-y-4">
                {settings.pastores.map((pastor) => (
                  <div key={pastor.nombre}>
                    <p className="font-display text-2xl text-ink">{pastor.nombre}</p>
                    <p className="mt-1 font-mono text-[0.58rem] uppercase tracking-[0.2em] text-pine">
                      {pastor.cargo}
                    </p>
                  </div>
                ))}
              </div>
            </Reveal>
          </div>

          <div className="relative">
            <ParallaxImage
              src="/images/iglesia.jpg"
              alt="Congregación reunida en el templo"
              className="aspect-[4/5] w-full"
              strength={6}
            >
              <div className="absolute inset-x-0 bottom-0 z-10 p-6 sm:p-8">
                <p className="font-display text-2xl leading-snug text-bone italic">
                  “Una iglesia de relación, no religión.”
                </p>
                <p className="mt-2 font-mono text-[0.55rem] uppercase tracking-[0.24em] text-gold">
                  Asambleas de Dios Getsemaní
                </p>
              </div>
            </ParallaxImage>

            <div className="absolute -bottom-6 -left-6 hidden border border-ink/15 bg-bone px-5 py-4 sm:block">
              <p className="font-mono text-[0.55rem] uppercase tracking-[0.2em] text-ink/40">
                Nuestra convicción
              </p>
              <p className="mt-1 font-display text-xl text-ink">Fe · Esperanza · Unidad</p>
            </div>
          </div>
        </div>
      </section>

      <section className="bg-ink py-20 sm:py-28">
        <div className="shell">
          <SectionHeading
            eyebrow="El corazón de la iglesia"
            title={
              <>
                Lo que nos mueve y hacia dónde <em className="italic text-gold">caminamos</em>
              </>
            }
            className="text-bone"
            lead="Tres convicciones que sostienen nuestra vida como congregación."
          />

          <div className="mt-12 grid gap-px overflow-hidden border border-bone/10 bg-bone/10 md:grid-cols-3">
            {PILLARS.map((pillar, index) => (
              <Reveal
                key={pillar.title}
                delay={index * 0.08}
                className="group relative bg-ink p-8 transition-colors duration-500 hover:bg-night sm:p-10"
              >
                <div className="flex items-center justify-between">
                  <span className="font-mono text-[0.6rem] text-bone/30">{pillar.number}</span>
                  <Icon
                    name={pillar.icon}
                    size={21}
                    className="text-gold/60 transition group-hover:text-gold"
                  />
                </div>
                <h3 className="mt-10 font-display text-3xl text-bone">{pillar.title}</h3>
                <p className="mt-4 text-sm leading-relaxed text-bone/55">{pillar.text}</p>
                <span className="absolute bottom-0 left-0 h-px w-0 bg-gold transition-all duration-700 group-hover:w-full" />
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      <section className="bg-bone py-20 text-ink sm:py-28">
        <div className="shell">
          <SectionHeading
            eyebrow="Nuestros valores"
            title={
              <>
                Lo que cuidamos en cada <em className="italic text-olive">encuentro</em>
              </>
            }
            className="text-ink"
            lead="No son solo palabras: son la forma en la que queremos tratarnos y servir."
          />

          <div className="mt-12 grid gap-x-10 gap-y-8 sm:grid-cols-2">
            {VALUES.map((value, index) => (
              <Reveal
                key={value.title}
                delay={index * 0.06}
                className="group flex gap-5 border-t border-ink/15 pt-6"
              >
                <span className="grid h-11 w-11 shrink-0 place-items-center rounded-full bg-pine/10 text-pine transition group-hover:bg-pine group-hover:text-bone">
                  <Icon name={value.icon} size={18} />
                </span>
                <div>
                  <h3 className="font-display text-2xl">{value.title}</h3>
                  <p className="mt-2 text-sm leading-relaxed text-ink/70">{value.text}</p>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      <section className="bg-ink py-20 sm:py-28">
        <div className="shell">
          <SectionHeading
            eyebrow="Fundamento"
            title={
              <>
                En qué <em className="italic text-gold">creemos</em>
              </>
            }
            className="text-bone"
            lead="Nuestras creencias fundamentales, basadas en la Palabra de Dios."
          />

          <div className="mt-12 grid gap-px overflow-hidden border border-bone/10 bg-bone/10 sm:grid-cols-2 lg:grid-cols-3">
            {BELIEFS.map((belief, index) => (
              <Reveal
                key={belief.title}
                delay={index * 0.04}
                className="bg-ink p-7 transition-colors duration-500 hover:bg-night"
              >
                <span className="font-mono text-[0.58rem] text-gold/60">
                  {String(index + 1).padStart(2, '0')}
                </span>
                <h3 className="mt-6 font-display text-xl text-bone">{belief.title}</h3>
                <p className="mt-3 text-sm leading-relaxed text-bone/50">{belief.text}</p>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      <ContactCTA />
    </>
  )
}
