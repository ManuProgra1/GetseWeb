import { useEffect, useRef } from 'react'
import { Outlet, useLocation } from 'react-router-dom'
import Navbar from '../components/navigation/navbar'
import Footer from '../components/navigation/footer'
import IntroLoader from '../components/common/intro-loader'
import ScrollToTop from '../components/common/scroll-to-top'
import WhatsAppButton from '../components/common/whatsapp-button'
import { gsap } from '../animations/register'
import {
  initSmoothScroll,
  killSmoothScroll,
  scrollToTop,
} from '../animations/smooth-scroll'
import { scheduleRefresh } from '../animations/refresh'
import { useMediaQuery, useReducedMotion } from '../hooks/use-reduced-motion'

export default function SiteLayout() {
  const { pathname } = useLocation()
  const mainRef = useRef(null)
  const reduced = useReducedMotion()
  const finePointer = useMediaQuery('(hover: hover) and (pointer: fine)')
  const enableSmooth = !reduced && finePointer

  useEffect(() => {
    if (!enableSmooth) {
      killSmoothScroll()
      return undefined
    }
    initSmoothScroll()
    return () => killSmoothScroll()
  }, [enableSmooth])

  useEffect(() => {
    scrollToTop(true)

    if (reduced || !mainRef.current) {
      scheduleRefresh(200)
      return undefined
    }

    const tween = gsap.fromTo(
      mainRef.current,
      { opacity: 0, y: 16 },
      { opacity: 1, y: 0, duration: 0.7, ease: 'power3.out', clearProps: 'opacity,transform' },
    )
    scheduleRefresh(260)

    return () => tween.kill()
  }, [pathname, reduced])

  return (
    <>
      <IntroLoader />
      <Navbar />
      <div id="smooth-wrapper">
        <div id="smooth-content">
          <main ref={mainRef}>
            <Outlet />
          </main>
          <Footer />
        </div>
      </div>
      <WhatsAppButton />
      <ScrollToTop />
    </>
  )
}
