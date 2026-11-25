import SplitHeading from './split-heading'
import Reveal from './reveal'

export default function PageHero({
  eyebrow,
  title,
  lead,
  image,
  imageAlt = '',
  meta,
  children,
}) {
  return (
    <section className="grain relative isolate overflow-hidden border-b border-gold/25 pt-36 pb-16 sm:pt-44 sm:pb-24">
      {image ? (
        <div className="absolute inset-0 -z-10">
          <img
            src={image}
            alt={imageAlt}
            fetchPriority="high"
            className="h-full w-full object-cover object-[center_45%]"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-ink via-ink/88 to-ink/45" />
          <div className="absolute inset-0 bg-gradient-to-t from-ink via-ink/50 to-ink/65" />
          <div className="absolute inset-0 bg-[radial-gradient(85%_70%_at_12%_18%,rgba(84,121,114,0.5),transparent_62%)]" />
          <div className="absolute inset-0 bg-[radial-gradient(55%_50%_at_88%_8%,rgba(230,201,161,0.22),transparent_65%)]" />
        </div>
      ) : (
        <div className="absolute inset-0 -z-10 bg-[radial-gradient(75%_75%_at_18%_0%,rgba(84,121,114,0.5),transparent_68%)]" />
      )}

      <div className="shell">
        {eyebrow && (
          <Reveal as="p" className="eyebrow flex items-center gap-3 text-gold" y={12} duration={0.7}>
            <span className="inline-block h-px w-8 bg-gold/70" />
            {eyebrow}
          </Reveal>
        )}

        <SplitHeading
          as="h1"
          mode="lines"
          trigger={false}
          delay={0.1}
          className="display mt-6 max-w-5xl text-[clamp(2.6rem,7vw,6.4rem)] text-bone"
        >
          {title}
        </SplitHeading>

        {lead && (
          <Reveal
            as="p"
            y={18}
            delay={0.3}
            className="mt-7 max-w-2xl text-base leading-relaxed text-bone/75 sm:text-lg"
          >
            {lead}
          </Reveal>
        )}

        {meta?.length > 0 && (
          <Reveal className="mt-10 flex flex-wrap gap-3" delay={0.4}>
            {meta.map((item) => (
              <div
                key={item.label}
                className="border border-bone/15 bg-ink/35 px-5 py-3 backdrop-blur-sm"
              >
                <p className="font-mono text-[0.58rem] uppercase tracking-[0.24em] text-sand/85">
                  {item.label}
                </p>
                <p className="mt-1 text-sm text-bone/90">{item.value}</p>
              </div>
            ))}
          </Reveal>
        )}

        {children && <div className="mt-10">{children}</div>}
      </div>
    </section>
  )
}
