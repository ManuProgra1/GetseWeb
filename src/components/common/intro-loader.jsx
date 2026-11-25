import { useEffect, useState } from 'react'
import { ScrollTrigger } from '../../animations/register'
import { useReducedMotion } from '../../hooks/use-reduced-motion'

export default function IntroLoader() {
  const [phase, setPhase] = useState('visible')
  const reduced = useReducedMotion()

  useEffect(() => {
    const hold = reduced ? 250 : 800
    const exit = reduced ? 500 : 1400

    document.documentElement.style.overflow = 'hidden'

    const leaveTimer = window.setTimeout(() => setPhase('leaving'), hold)
    const doneTimer = window.setTimeout(() => {
      setPhase('hidden')
      document.documentElement.style.overflow = ''
      ScrollTrigger.refresh()
    }, exit)

    return () => {
      window.clearTimeout(leaveTimer)
      window.clearTimeout(doneTimer)
      document.documentElement.style.overflow = ''
    }
  }, [reduced])

  if (phase === 'hidden') return null

  return (
    <div
      aria-hidden="true"
      className={`fixed inset-0 z-[400] grid place-items-center bg-ink transition-opacity duration-700 ease-out ${
        phase === 'leaving' ? 'pointer-events-none opacity-0' : 'opacity-100'
      }`}
    >
      <div className="flex flex-col items-center px-8 text-center">
        <span className="grid h-14 w-14 place-items-center overflow-hidden rounded-full bg-bone">
          <img src="/images/logo.jpg" alt="" className="h-full w-full object-cover" />
        </span>
        <p className="mt-7 font-display text-3xl tracking-tight text-bone sm:text-4xl">
          Getsemaní
        </p>
        <p className="mt-3 font-mono text-[0.58rem] uppercase tracking-[0.42em] text-bone/50">
          Asambleas de Dios
        </p>
        <span className="loader-line mt-8 block h-px w-32 bg-gold" />
      </div>
    </div>
  )
}
