import { createContext, useContext, useMemo } from 'react'
import { DEFAULT_SETTINGS } from '../data/content'
import { useDocument } from '../hooks/use-collection'

const SettingsContext = createContext(null)

function mergeSettings(data) {
  if (!data) return DEFAULT_SETTINGS
  return {
    ...DEFAULT_SETTINGS,
    ...data,
    redesSociales: {
      ...DEFAULT_SETTINGS.redesSociales,
      ...(data.redesSociales ?? {}),
    },
    horarios: Array.isArray(data.horarios) && data.horarios.length
      ? data.horarios
      : DEFAULT_SETTINGS.horarios,
  }
}

export function SettingsProvider({ children }) {
  const { data, loading, error, source } = useDocument('settings', 'main', DEFAULT_SETTINGS)
  const settings = useMemo(() => mergeSettings(data), [data])

  const value = useMemo(
    () => ({ settings, loading, error, source }),
    [settings, loading, error, source],
  )

  return <SettingsContext.Provider value={value}>{children}</SettingsContext.Provider>
}

export function useSettings() {
  const context = useContext(SettingsContext)
  if (!context) throw new Error('useSettings debe usarse dentro de SettingsProvider')
  return context
}
