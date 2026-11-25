import { useLayoutEffect, useState } from 'react'
import { ScrollTrigger } from '../animations/register'

const QUERY = '(prefers-reduced-motion: reduce)'

export function useReducedMotion() {
  const [reduced, setReduced] = useState(
    () => typeof window !== 'undefined' && window.matchMedia(QUERY).matches,
  )

  useLayoutEffect(() => {
    const media = window.matchMedia(QUERY)
    const listener = (event) => {
      setReduced(event.matches)
      ScrollTrigger.refresh()
    }
    media.addEventListener('change', listener)
    return () => media.removeEventListener('change', listener)
  }, [])

  return reduced
}

export function useMediaQuery(query) {
  const [matches, setMatches] = useState(
    () => typeof window !== 'undefined' && window.matchMedia(query).matches,
  )

  useLayoutEffect(() => {
    const media = window.matchMedia(query)
    const listener = (event) => setMatches(event.matches)
    media.addEventListener('change', listener)
    return () => media.removeEventListener('change', listener)
  }, [query])

  return matches
}
