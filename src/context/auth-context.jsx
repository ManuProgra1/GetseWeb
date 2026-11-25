import { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react'
import { onAuthStateChanged } from 'firebase/auth'
import { auth, isFirebaseConfigured } from '../lib/firebase'
import {
  fetchProfile,
  signInRequest,
  signOutRequest,
  updateUserRole,
} from '../services/auth'

const AuthContext = createContext(null)

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null)
  const [profile, setProfile] = useState(null)
  const [loading, setLoading] = useState(isFirebaseConfigured)
  const [profileError, setProfileError] = useState(null)

  useEffect(() => {
    if (!isFirebaseConfigured || !auth) {
      setLoading(false)
      return undefined
    }

    let active = true
    const unsubscribe = onAuthStateChanged(auth, async (nextUser) => {
      if (!active) return
      setUser(nextUser)
      setProfileError(null)

      if (!nextUser) {
        setProfile(null)
        setLoading(false)
        return
      }

      try {
        const nextProfile = await fetchProfile(nextUser.uid)
        if (!active) return
        setProfile(nextProfile)
        if (!nextProfile) {
          setProfileError(
            'Tu cuenta existe, pero aún no tiene un perfil con rol asignado. Solicita acceso al administrador.',
          )
        }
      } catch (error) {
        console.error('[auth] No se pudo cargar el perfil:', error)
        if (!active) return
        setProfile(null)
        setProfileError('No pudimos leer tu perfil. Revisa las reglas de Firestore.')
      } finally {
        if (active) setLoading(false)
      }
    })

    return () => {
      active = false
      unsubscribe()
    }
  }, [])

  const refreshProfile = useCallback(async () => {
    if (!user) return null
    const nextProfile = await fetchProfile(user.uid)
    setProfile(nextProfile)
    return nextProfile
  }, [user])

  const signIn = useCallback(async (email, password) => {
    setLoading(true)
    try {
      return await signInRequest(email, password)
    } finally {
      setLoading(false)
    }
  }, [])

  const signOut = useCallback(async () => {
    await signOutRequest()
    setProfile(null)
    setUser(null)
  }, [])

  const changeRole = useCallback(async (uid, rol) => {
    const result = await updateUserRole(uid, rol)
    setProfile((current) => (current?.id === uid ? { ...current, rol } : current))
    return result
  }, [])

  const role = profile?.rol ?? 'publico'
  const value = useMemo(
    () => ({
      user,
      profile,
      role,
      name: profile?.nombre || user?.displayName || user?.email || '',
      isAdmin: role === 'administrador',
      isEditor: role === 'administrador' || role === 'editor',
      loading,
      configured: isFirebaseConfigured,
      profileError,
      signIn,
      signOut,
      refreshProfile,
      changeRole,
    }),
    [user, profile, role, loading, profileError, signIn, signOut, refreshProfile, changeRole],
  )

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (!context) throw new Error('useAuth debe usarse dentro de AuthProvider')
  return context
}
