import SplitHeading from './split-heading'
import Reveal from './reveal'

export default function SectionHeading({
  eyebrow,
  title,
  lead,
  action,
  className = '',
  align = 'left',
  tone = 'dark',
  titleClassName = '',
}) {
  const alignment = align === 'center' ? 'items-center text-center mx-auto' : 'items-start'
  const eyebrowColor = tone === 'light' ? 'text-pine' : 'text-gold'
  const ruleColor = tone === 'light' ? 'bg-pine/60' : 'bg-gold/60'

  return (
    <div className={`flex flex-col gap-6 ${alignment} ${className}`}>
      <div className={`flex w-full flex-col gap-5 ${align === 'center' ? 'items-center' : 'items-start'}`}>
        {eyebrow && (
          <Reveal
            as="span"
            className={`eyebrow flex items-center gap-3 ${eyebrowColor}`}
            y={10}
            duration={0.6}
          >
            <span className={`inline-block h-px w-7 ${ruleColor}`} />
            {eyebrow}
          </Reveal>
        )}

        <SplitHeading
          as="h2"
          className={`display max-w-3xl text-[clamp(1.95rem,4.4vw,4rem)] ${titleClassName}`}
        >
          {title}
        </SplitHeading>

        {lead && (
          <Reveal
            as="p"
            y={16}
            delay={0.15}
            className={`max-w-xl text-sm leading-relaxed opacity-70 sm:text-base ${
              align === 'center' ? 'mx-auto' : ''
            }`}
          >
            {lead}
          </Reveal>
        )}
      </div>

      {action && (
        <Reveal delay={0.2} y={12} className={align === 'center' ? 'mx-auto' : 'self-start sm:self-auto'}>
          {action}
        </Reveal>
      )}
    </div>
  )
}
