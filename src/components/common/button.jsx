import { useCallback, useRef } from 'react'
import { Link } from 'react-router-dom'
import { gsap } from '../../animations/register'
import { useMediaQuery, useReducedMotion } from '../../hooks/use-reduced-motion'
import { Icon } from './icons'

const base =
  'group relative inline-flex items-center justify-center gap-3 rounded-full font-medium uppercase transition-colors duration-300 disabled:cursor-not-allowed disabled:opacity-50'

const sizes = {
  sm: 'px-5 py-2.5 text-[0.64rem] tracking-[0.2em]',
  md: 'px-7 py-3.5 text-[0.7rem] tracking-[0.2em]',
  lg: 'px-8 py-4 text-[0.72rem] tracking-[0.2em]',
}

const variants = {
  primary: 'bg-gold text-ink hover:bg-[#efe4c6]',
  solid: 'bg-bone text-ink hover:bg-white',
  outline: 'border border-white/30 text-bone hover:border-white/70 hover:bg-white/5',
  outlineDark: 'border border-ink/25 text-ink hover:border-ink/60 hover:bg-ink/5',
  ghost: 'text-bone/70 hover:text-gold',
  dark: 'bg-ink text-bone hover:bg-moss',
}

export default function Button({
  children,
  to,
  href,
  variant = 'primary',
  size = 'md',
  icon = 'arrow-right',
  iconPosition = 'right',
  className = '',
  type = 'button',
  ...rest
}) {
  const ref = useRef(null)
  const reduced = useReducedMotion()
  const finePointer = useMediaQuery('(hover: hover) and (pointer: fine)')
  const magnetic = finePointer && !reduced

  const handleMove = useCallback(
    (event) => {
      if (!magnetic || !ref.current) return
      const rect = ref.current.getBoundingClientRect()
      const x = ((event.clientX - rect.left) / rect.width - 0.5) * 12
      const y = ((event.clientY - rect.top) / rect.height - 0.5) * 14
      gsap.to(ref.current, { x, y, duration: 0.45, ease: 'power2.out' })
    },
    [magnetic],
  )

  const handleLeave = useCallback(() => {
    if (!ref.current) return
    gsap.to(ref.current, { x: 0, y: 0, duration: 0.7, ease: 'elastic.out(1, 0.4)' })
  }, [])

  const classes = `${base} ${sizes[size]} ${variants[variant]} ${className}`
  const content = (
    <>
      {iconPosition === 'left' && icon && (
        <Icon name={icon} size={15} className="transition-transform duration-300 group-hover:-translate-x-1" />
      )}
      <span>{children}</span>
      {iconPosition === 'right' && icon && (
        <Icon name={icon} size={15} className="transition-transform duration-300 group-hover:translate-x-1" />
      )}
    </>
  )

  const interactionProps = {
    onMouseMove: handleMove,
    onMouseLeave: handleLeave,
  }

  if (to) {
    return (
      <Link ref={ref} to={to} className={classes} {...interactionProps} {...rest}>
        {content}
      </Link>
    )
  }

  if (href) {
    return (
      <a
        ref={ref}
        href={href}
        target={href.startsWith('http') ? '_blank' : undefined}
        rel={href.startsWith('http') ? 'noreferrer noopener' : undefined}
        className={classes}
        {...interactionProps}
        {...rest}
      >
        {content}
      </a>
    )
  }

  return (
    <button ref={ref} type={type} className={classes} {...interactionProps} {...rest}>
      {content}
    </button>
  )
}
