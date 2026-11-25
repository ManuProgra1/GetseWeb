import { useLayoutEffect, useRef } from 'react'
import { gsap } from './register'

/**
 * Crea un contexto de GSAP limitado al elemento y lo revierte al desmontar.
 * Centraliza la limpieza de tweens y ScrollTriggers de cada sección.
 */
export function useScene(build, deps = []) {
  const scope = useRef(null)

  useLayoutEffect(() => {
    const element = scope.current
    if (!element) return undefined

    const context = gsap.context(() => build(element), element)

    return () => context.revert()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, deps)

  return scope
}
