import { Icon } from '../common/icons'

export function AdminPageHeader({ eyebrow, title, description, action }) {
  return (
    <div className="flex flex-col gap-4 border-b border-[#25342e]/10 pb-6 sm:flex-row sm:items-end sm:justify-between">
      <div>
        {eyebrow && (
          <p className="font-mono text-[0.58rem] uppercase tracking-[0.22em] text-[#547972]">
            {eyebrow}
          </p>
        )}
        <h1 className="mt-2 font-display text-[clamp(1.9rem,3.4vw,2.7rem)] leading-tight text-[#1f2a26]">
          {title}
        </h1>
        {description && (
          <p className="mt-2 max-w-2xl text-sm leading-relaxed text-[#55645d]">{description}</p>
        )}
      </div>
      {action && <div className="shrink-0">{action}</div>}
    </div>
  )
}

export function AdminCard({ children, className = '' }) {
  return (
    <div className={`border border-[#25342e]/10 bg-white ${className}`}>{children}</div>
  )
}

export function EmptyState({ icon = 'sparkle', title, description, action }) {
  return (
    <div className="flex flex-col items-center justify-center border border-dashed border-[#25342e]/15 bg-white px-6 py-14 text-center">
      <span className="grid h-12 w-12 place-items-center rounded-full bg-[#25342e]/5 text-[#547972]">
        <Icon name={icon} size={22} />
      </span>
      <p className="mt-5 font-display text-2xl text-[#1f2a26]">{title}</p>
      {description && (
        <p className="mt-2 max-w-sm text-sm leading-relaxed text-[#55645d]">{description}</p>
      )}
      {action && <div className="mt-6">{action}</div>}
    </div>
  )
}

export function StatusBadge({ status }) {
  const published = status === 'publicado'
  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-[0.62rem] font-medium ${
        published ? 'bg-[#3f6b52]/10 text-[#3f6b52]' : 'bg-[#9b4a32]/10 text-[#9b4a32]'
      }`}
    >
      <span
        className={`h-1.5 w-1.5 rounded-full ${published ? 'bg-[#3f6b52]' : 'bg-[#9b4a32]'}`}
      />
      {published ? 'Publicado' : 'Borrador'}
    </span>
  )
}

export function IconButton({ icon, label, onClick, tone = 'default', type = 'button', ...rest }) {
  const tones = {
    default: 'border-[#25342e]/15 text-[#44544d] hover:border-[#25342e]/40 hover:text-[#25342e]',
    danger: 'border-[#9b4a32]/25 text-[#9b4a32] hover:border-[#9b4a32]/60 hover:bg-[#9b4a32]/5',
  }
  return (
    <button
      type={type}
      onClick={onClick}
      aria-label={label}
      title={label}
      className={`grid h-9 w-9 place-items-center rounded-full border transition ${tones[tone]}`}
      {...rest}
    >
      <Icon name={icon} size={15} />
    </button>
  )
}

export function AdminButton({
  children,
  onClick,
  type = 'button',
  variant = 'primary',
  icon,
  disabled,
  className = '',
}) {
  const variants = {
    primary: 'bg-[#1f2a26] text-[#f4efdf] hover:bg-[#33504a]',
    outline: 'border border-[#25342e]/20 text-[#25342e] hover:border-[#25342e]/50',
    gold: 'bg-[#e6c9a1] text-[#1f2a26] hover:bg-[#efe4c6]',
  }

  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled}
      className={`inline-flex items-center justify-center gap-2.5 rounded-full px-5 py-2.5 text-[0.65rem] font-medium uppercase tracking-[0.16em] transition disabled:cursor-not-allowed disabled:opacity-50 ${variants[variant]} ${className}`}
    >
      {icon && <Icon name={icon} size={14} />}
      {children}
    </button>
  )
}
