import { useEffect, useRef, useState } from 'react'
import { Link, NavLink, useLocation } from 'react-router-dom'
import { createPortal } from 'react-dom'
import Logo from '../common/logo'
import Button from '../common/button'
import { Icon } from '../common/icons'
import { gsap } from '../../animations/register'
import { useSettings } from '../../context/settings-context'

const LINKS = [
  { to: '/', label: 'Inicio', end: true },
  { to: '/nosotros', label: 'Nosotros' },
  { to: '/historia', label: 'Historia' },
  { to: '/ministerios', label: 'Ministerios' },
  { to: '/eventos', label: 'Eventos' },
  { to: '/contacto', label: 'Contacto' },
]

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false)
  const [open, setOpen] = useState(false)
  const progressRef = useRef(null)
  const overlayRef = useRef(null)
  const location = useLocation()
  const { settings } = useSettings()

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40)
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  useEffect(() => {
    setOpen(false)
  }, [location.pathname])

  useEffect(() => {
    if (!progressRef.current) return undefined
    const tween = gsap.to(progressRef.current, {
      scaleX: 1,
      ease: 'none',
      scrollTrigger: { start: 0, end: 'max', scrub: 0.35 },
    })
    return () => {
      tween.scrollTrigger?.kill()
      tween.kill()
    }
  }, [])

  useEffect(() => {
    if (!open) return undefined

    document.documentElement.style.overflow = 'hidden'
    const context = gsap.context(() => {
      gsap.fromTo(overlayRef.current, { opacity: 0 }, { opacity: 1, duration: 0.35, ease: 'power2.out' })
      gsap.fromTo(
        '[data-mobile-link]',
        { yPercent: 110, opacity: 0 },
        { yPercent: 0, opacity: 1, duration: 0.75, stagger: 0.055, delay: 0.08, ease: 'power3.out' },
      )
      gsap.fromTo(
        '[data-mobile-foot]',
        { opacity: 0, y: 14 },
        { opacity: 1, y: 0, duration: 0.6, delay: 0.35, ease: 'power2.out' },
      )
    }, overlayRef)

    const onKey = (event) => {
      if (event.key === 'Escape') setOpen(false)
    }
    window.addEventListener('keydown', onKey)

    return () => {
      document.documentElement.style.overflow = ''
      context.revert()
      window.removeEventListener('keydown', onKey)
    }
  }, [open])

  const handleMenuClose = () => {
    if (!overlayRef.current) {
      setOpen(false)
      return
    }
    gsap.to(overlayRef.current, {
      opacity: 0,
      duration: 0.28,
      ease: 'power2.in',
      onComplete: () => setOpen(false),
    })
  }

  return (
    <>
      <header
        className={`fixed inset-x-0 top-0 z-[120] transition-all duration-500 ${
          scrolled
            ? 'border-b border-bone/10 bg-ink/85 py-2 backdrop-blur-xl'
            : 'border-b border-transparent bg-gradient-to-b from-ink/70 to-transparent py-4'
        }`}
      >
        <nav className="shell flex items-center justify-between gap-6" aria-label="Navegación principal">
          <Link to="/" aria-label="Inicio — Asambleas de Dios Getsemaní" className="shrink-0">
            <Logo className="text-bone" />
          </Link>

          <ul className="hidden items-center gap-8 lg:flex">
            {LINKS.map((link) => (
              <li key={link.to}>
                <NavLink
                  to={link.to}
                  end={link.end}
                  className={({ isActive }) =>
                    `group relative block py-2 text-[0.72rem] font-medium uppercase tracking-[0.18em] transition-colors duration-300 ${
                      isActive ? 'text-gold' : 'text-bone/70 hover:text-bone'
                    }`
                  }
                >
                  {({ isActive }) => (
                    <>
                      {link.label}
                      <span
                        className={`absolute -bottom-0.5 left-0 h-px bg-gold transition-all duration-500 ${
                          isActive ? 'w-full' : 'w-0 group-hover:w-full'
                        }`}
                      />
                    </>
                  )}
                </NavLink>
              </li>
            ))}
          </ul>

          <div className="hidden items-center gap-5 lg:flex">
            <Link
              to="/admin/login"
              className="inline-flex items-center gap-2 text-[0.66rem] font-medium uppercase tracking-[0.18em] text-bone/60 transition hover:text-gold"
            >
              <Icon name="lock" size={13} />
              Acceder
            </Link>
            <Button to="/contacto" variant="outline" size="sm" icon="map-pin">
              Visítanos
            </Button>
          </div>

          <button
            type="button"
            onClick={() => setOpen(true)}
            aria-label="Abrir menú"
            aria-expanded={open}
            className="grid h-10 w-10 place-items-center rounded-full border border-bone/20 text-bone transition hover:border-gold/60 hover:text-gold lg:hidden"
          >
            <Icon name="menu" size={18} />
          </button>
        </nav>

        <span
          ref={progressRef}
          aria-hidden="true"
          className="absolute bottom-0 left-0 h-px w-full origin-left scale-x-0 bg-gold/70"
        />
      </header>

      {open &&
        createPortal(
          <div
            ref={overlayRef}
            className="fixed inset-0 z-[200] flex flex-col bg-ink text-bone"
            role="dialog"
            aria-modal="true"
            aria-label="Menú de navegación"
          >
            <div className="shell flex items-center justify-between py-5">
              <Logo className="text-bone" />
              <button
                type="button"
                onClick={handleMenuClose}
                aria-label="Cerrar menú"
                className="grid h-10 w-10 place-items-center rounded-full border border-bone/20 transition hover:border-gold/60 hover:text-gold"
              >
                <Icon name="close" size={18} />
              </button>
            </div>

            <div className="shell flex flex-1 flex-col justify-center overflow-y-auto py-8">
              <ul className="space-y-1">
                {LINKS.map((link, index) => (
                  <li key={link.to} className="overflow-hidden">
                    <Link
                      to={link.to}
                      data-mobile-link
                      onClick={handleMenuClose}
                      className="flex items-baseline gap-4 py-2 font-display text-[clamp(2.4rem,9vw,4rem)] leading-none text-bone/90 transition-colors hover:text-gold"
                    >
                      <span className="font-mono text-[0.6rem] tracking-[0.2em] text-bone/35">
                        0{index + 1}
                      </span>
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            <div
              data-mobile-foot
              className="shell flex flex-col gap-5 border-t border-bone/10 py-6 text-sm text-bone/55"
            >
              <div className="flex flex-wrap gap-x-8 gap-y-2">
                {settings.horarios
                  .filter((item) => item.dia === 'Domingo')
                  .map((item) => (
                    <span key={`${item.dia}-${item.hora}`}>
                      <span className="text-bone/80">{item.dia}</span> · {item.hora}
                    </span>
                  ))}
              </div>
              <div className="flex items-center justify-between gap-4">
                <div className="flex items-center gap-5">
                  <Link to="/contacto" onClick={handleMenuClose} className="text-gold">
                    Contáctanos
                  </Link>
                  <Link
                    to="/admin/login"
                    onClick={handleMenuClose}
                    className="inline-flex items-center gap-2 text-bone/60 transition hover:text-gold"
                  >
                    <Icon name="lock" size={13} />
                    Acceder
                  </Link>
                </div>
                <a
                  href={settings.redesSociales.facebook || '#'}
                  target="_blank"
                  rel="noreferrer noopener"
                  className="grid h-9 w-9 place-items-center rounded-full border border-bone/20"
                  aria-label="Facebook"
                >
                  <Icon name="facebook" size={15} />
                </a>
              </div>
            </div>
          </div>,
          document.body,
        )}
    </>
  )
}
