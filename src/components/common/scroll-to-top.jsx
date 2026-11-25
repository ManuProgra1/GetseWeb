import { useEffect, useState } from 'react'
import { Icon } from './icons'
import { getSmoothScroll } from '../../animations/smooth-scroll'

export default function ScrollToTop() {
  const [visible, setVisible] = useState(false)

  useEffect(() => {
    let frame = null
    const handleScroll = () => {
      if (frame) return
      frame = window.requestAnimationFrame(() => {
        setVisible(window.scrollY > 500)
        frame = null
      })
    }
    window.addEventListener('scroll', handleScroll, { passive: true })
    handleScroll()
    return () => {
      window.removeEventListener('scroll', handleScroll)
      if (frame) window.cancelAnimationFrame(frame)
    }
  }, [])

  const handleClick = () => {
    const smoother = getSmoothScroll()
    if (smoother) {
      smoother.scrollTo(0, false)
    } else {
      window.scrollTo({ top: 0, behavior: 'smooth' })
    }
  }

  return (
    <button
      type="button"
      onClick={handleClick}
      aria-label="Volver arriba"
      className={`fixed right-5 bottom-5 z-[80] grid h-11 w-11 place-items-center rounded-full border border-bone/20 bg-ink/80 text-bone backdrop-blur-md transition-all duration-500 hover:border-gold/60 hover:text-gold sm:right-7 sm:bottom-7 sm:h-12 sm:w-12 ${
        visible ? 'translate-y-0 opacity-100' : 'pointer-events-none translate-y-4 opacity-0'
      }`}
    >
      <Icon name="arrow-up-right" size={17} className="-rotate-45" />
    </button>
  )
}
