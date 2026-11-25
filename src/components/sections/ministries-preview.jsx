import { Link } from 'react-router-dom'
import Reveal from '../common/reveal'
import SectionHeading from '../common/section-heading'
import Button from '../common/button'
import { Icon } from '../common/icons'
import { initials } from '../../utils/misc'

export default function MinistriesPreview({ ministries }) {
  return (
    <section className="bg-bone py-20 text-ink sm:py-28">
      <div className="shell">
        <SectionHeading
          eyebrow="Áreas de servicio"
          title={
            <>
              Ministerios que sirven, <em className="italic text-olive">forman y acompañan</em>
            </>
          }
          lead="Cada ministerio es una puerta para crecer y servir. Encuentra el lugar donde tus dones pueden bendecir a otros."
          className="text-ink"
          tone="light"
          action={
            <Button to="/ministerios" variant="outlineDark" size="md" icon="arrow-up-right">
              Ver todos los ministerios
            </Button>
          }
        />

        <div className="mt-14 border-b border-ink/15">
          {ministries.map((ministry, index) => {
            const slug = ministry.slug || ministry.id
            const mark = ministry.logo

            return (
              <Reveal key={ministry.id || ministry.nombre} delay={index * 0.04} y={18}>
                <Link
                  to={`/ministerios/${slug}`}
                  className="group flex items-center gap-4 border-t border-ink/15 px-2 py-6 transition-colors duration-500 hover:bg-pine hover:text-bone sm:gap-8 sm:px-5 sm:py-7"
                >
                  <span className="w-7 shrink-0 font-mono text-[0.6rem] text-ink/35 transition group-hover:text-gold/70">
                    {String(index + 1).padStart(2, '0')}
                  </span>

                  <div className="flex min-w-0 flex-1 items-center gap-5">
                    <span
                      className="grid h-11 w-11 shrink-0 place-items-center overflow-hidden rounded-full ring-1 ring-ink/10 transition group-hover:ring-bone/20 sm:h-14 sm:w-14"
                      style={{ backgroundColor: `${ministry.acento || '#e6c9a1'}1a` }}
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
                          className="font-display text-lg"
                          style={{ color: ministry.acento || '#e6c9a1' }}
                        >
                          {initials(ministry.nombre)}
                        </span>
                      )}
                    </span>

                    <div className="min-w-0">
                      <h3 className="font-display text-[clamp(1.6rem,3.4vw,2.8rem)] leading-none transition-transform duration-500 group-hover:translate-x-1">
                        {ministry.nombre}
                      </h3>
                      <p className="mt-2 max-w-lg truncate text-xs text-ink/60 transition group-hover:text-bone/70 sm:text-sm">
                        {ministry.lema || ministry.descripcion}
                      </p>
                    </div>
                  </div>

                  <span className="hidden shrink-0 items-center gap-3 text-xs text-ink/50 transition group-hover:text-bone/80 md:flex">
                    Conocer más
                  </span>

                  <span className="grid h-9 w-9 shrink-0 place-items-center rounded-full border border-ink/25 transition duration-500 group-hover:rotate-45 group-hover:border-sand/70 group-hover:text-sand">
                    <Icon name="arrow-up-right" size={15} />
                  </span>
                </Link>
              </Reveal>
            )
          })}
        </div>
      </div>
    </section>
  )
}
