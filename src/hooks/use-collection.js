import { useEffect, useRef, useState } from 'react'
import {
  collection,
  doc,
  limit as firestoreLimit,
  onSnapshot,
  orderBy,
  query,
  where,
} from 'firebase/firestore'
import { db, isFirebaseConfigured } from '../lib/firebase'
import { scheduleRefresh } from '../animations/refresh'

/**
 * Suscripción en tiempo real a una colección.
 * - `published`: limita la consulta a documentos publicados (regla pública).
 * - `fallback`: contenido local que se muestra mientras no hay datos o
 *   cuando Firebase todavía no está configurado.
 */
export function useCollection(name, options = {}) {
  const {
    published = false,
    order = null,
    limit: max = null,
    fallback = null,
    enabled = true,
  } = options
  const fallbackRef = useRef(fallback)
  fallbackRef.current = fallback

  const [state, setState] = useState(() => ({
    items: fallback ?? [],
    loading: enabled && isFirebaseConfigured,
    error: null,
    source: enabled && isFirebaseConfigured ? 'firestore' : 'local',
  }))

  const orderField = order?.[0]
  const orderDirection = order?.[1]

  useEffect(() => {
    if (!enabled || !isFirebaseConfigured || !db) {
      setState({
        items: fallbackRef.current ?? [],
        loading: false,
        error: null,
        source: 'local',
      })
      return undefined
    }

    const constraints = []
    if (published) constraints.push(where('estado', '==', 'publicado'))
    if (orderField) constraints.push(orderBy(orderField, orderDirection ?? 'asc'))
    if (max) constraints.push(firestoreLimit(max))

    const reference = query(collection(db, name), ...constraints)
    setState((current) => ({ ...current, loading: true }))

    const unsubscribe = onSnapshot(
      reference,
      (snapshot) => {
        const items = snapshot.docs.map((entry) => ({ id: entry.id, ...entry.data() }))
        setState({
          items: items.length ? items : fallbackRef.current ?? [],
          loading: false,
          error: null,
          source: items.length ? 'firestore' : 'local',
        })
        scheduleRefresh()
      },
      (error) => {
        console.error(`[firestore] ${name}:`, error)
        setState({
          items: fallbackRef.current ?? [],
          loading: false,
          error: error?.code || error?.message || 'Error de conexión',
          source: 'local',
        })
      },
    )

    return unsubscribe
  }, [name, published, orderField, orderDirection, max, enabled])

  return state
}

/** Suscripción a un documento único (por ejemplo settings/main). */
export function useDocument(name, id, fallback = null) {
  const fallbackRef = useRef(fallback)
  fallbackRef.current = fallback

  const [state, setState] = useState(() => ({
    data: fallback,
    loading: isFirebaseConfigured,
    error: null,
    source: isFirebaseConfigured ? 'firestore' : 'local',
  }))

  useEffect(() => {
    if (!isFirebaseConfigured || !db) {
      setState({ data: fallbackRef.current, loading: false, error: null, source: 'local' })
      return undefined
    }

    const unsubscribe = onSnapshot(
      doc(db, name, id),
      (snapshot) => {
        setState({
          data: snapshot.exists()
            ? { id: snapshot.id, ...snapshot.data() }
            : fallbackRef.current,
          loading: false,
          error: null,
          source: snapshot.exists() ? 'firestore' : 'local',
        })
        scheduleRefresh()
      },
      (error) => {
        console.error(`[firestore] ${name}/${id}:`, error)
        setState({
          data: fallbackRef.current,
          loading: false,
          error: error?.code || error?.message || 'Error de conexión',
          source: 'local',
        })
      },
    )

    return unsubscribe
  }, [name, id])

  return state
}
