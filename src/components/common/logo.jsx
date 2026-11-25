import { useSettings } from '../../context/settings-context'

export default function Logo({ className = '', markOnly = false, size = 'md' }) {
  const { settings } = useSettings()
  const dimension = size === 'lg' ? 'h-12 w-12' : 'h-10 w-10'

  return (
    <span className={`flex items-center gap-3 ${className}`}>
      <span
        className={`grid ${dimension} shrink-0 place-items-center overflow-hidden rounded-full bg-bone ring-1 ring-white/10`}
      >
        <img
          src={settings.logo || '/images/logo.jpg'}
          alt=""
          width="48"
          height="48"
          className="h-full w-full object-cover"
        />
      </span>
      {!markOnly && (
        <span className="leading-none">
          <span className="block font-display text-[1.1rem] tracking-tight sm:text-[1.2rem]">
            Asambleas de Dios
          </span>
          <span className="mt-1.5 block font-mono text-[0.55rem] uppercase tracking-[0.32em] opacity-60">
            Getsemaní
          </span>
        </span>
      )}
    </span>
  )
}
