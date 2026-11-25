import { useState } from 'react'
import { Link, Navigate, useLocation, useNavigate } from 'react-router-dom'
import { useAuth } from '../../context/auth-context'
import { isFirebaseConfigured } from '../../lib/firebase'
import SetupNotice from './setup-notice'
import { Icon } from '../../components/common/icons'
import { Field, TextInput } from '../../components/admin/field'

const ERROR_MESSAGES = {
  'auth/invalid-credential': 'Usuario o contraseña incorrectos.',
  'auth/wrong-password': 'Usuario o contraseña incorrectos.',
  'auth/user-not-found': 'No existe una cuenta con este usuario.',
  'auth/invalid-email': 'El usuario contiene caracteres no válidos.',
  'auth/too-many-requests': 'Demasiados intentos. Espera unos minutos e intenta de nuevo.',
  'auth/network-request-failed': 'No hay conexión. Revisa tu red e intenta nuevamente.',
}

export default function Login() {
  const { user, isEditor, signIn, loading } = useAuth()
  const [usuario, setUsuario] = useState('')
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [error, setError] = useState('')
  const [submitting, setSubmitting] = useState(false)
  const navigate = useNavigate()
  const location = useLocation()

  if (!isFirebaseConfigured) return <SetupNotice />
  if (user && isEditor && !loading) return <Navigate to="/admin" replace />

  const handleSubmit = async (event) => {
    event.preventDefault()
    setError('')

    if (!usuario.trim() || !password) {
      setError('Completa tu usuario y contraseña.')
      return
    }

    setSubmitting(true)
    try {
      await signIn(usuario, password)
      navigate(location.state?.from || '/admin', { replace: true })
    } catch (signInError) {
      console.error(signInError)
      setError(ERROR_MESSAGES[signInError.code] || 'No pudimos iniciar sesión. Intenta de nuevo.')
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <div className="grid min-h-screen bg-[#f4efdf] text-[#25342e] lg:grid-cols-2">
      <div className="relative hidden overflow-hidden bg-ink lg:block">
        <img
          src="images/iglesia.jpg"
          alt=""
          className="h-full w-full object-cover opacity-45"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-ink via-ink/50 to-ink/20" />
        <div className="absolute inset-x-0 bottom-0 p-12">
          <p className="eyebrow text-gold">Asambleas de Dios Getsemaní</p>
          <p className="mt-5 max-w-sm font-display text-4xl leading-tight text-bone">
            Cuidar el mensaje también es una forma de <em className="italic text-gold">servir</em>.
          </p>
          <p className="mt-4 max-w-sm text-sm leading-relaxed text-bone/50">
            Administra el contenido, la publicidad y los registros desde un solo lugar.
          </p>
        </div>
      </div>

      <div className="flex items-center justify-center p-6 sm:p-12">
        <div className="w-full max-w-sm">
          <Link
            to="/"
            className="inline-flex items-center gap-2 font-mono text-[0.58rem] uppercase tracking-[0.22em] text-[#5f6d66] transition hover:text-[#25342e]"
          >
            <Icon name="arrow-left" size={13} />
            Volver al sitio
          </Link>

          <h1 className="mt-8 font-display text-4xl leading-tight text-[#1f2a26]">
            Panel de administración
          </h1>
          <p className="mt-3 text-sm leading-relaxed text-[#55645d]">
            Ingresa con el usuario y la contraseña asignados por la iglesia. No existe registro público.
          </p>

          <form onSubmit={handleSubmit} noValidate className="mt-8 space-y-5">
            <Field label="Usuario" htmlFor="admin-usuario" required>
              <TextInput
                id="admin-usuario"
                type="text"
                autoComplete="username"
                autoCapitalize="none"
                autoCorrect="off"
                spellCheck={false}
                value={usuario}
                onChange={(event) => setUsuario(event.target.value)}
                placeholder="admin"
              />
            </Field>

            <Field label="Contraseña" htmlFor="admin-password" required>
              <div className="relative">
                <TextInput
                  id="admin-password"
                  type={showPassword ? 'text' : 'password'}
                  autoComplete="current-password"
                  value={password}
                  onChange={(event) => setPassword(event.target.value)}
                  placeholder="••••••••"
                  className="pr-12"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword((current) => !current)}
                  aria-label={showPassword ? 'Ocultar contraseña' : 'Mostrar contraseña'}
                  className="absolute top-1/2 right-2 -translate-y-1/2 p-2 text-[#5f6d66] transition hover:text-[#25342e]"
                >
                  <Icon name={showPassword ? 'lock' : 'eye'} size={16} />
                </button>
              </div>
            </Field>

            {error && (
              <p role="alert" className="border border-[#9b4a32]/25 bg-[#9b4a32]/5 p-3 text-xs text-[#9b4a32]">
                {error}
              </p>
            )}

            {user && !isEditor && (
              <p className="border border-[#9b4a32]/25 bg-[#9b4a32]/5 p-3 text-xs leading-relaxed text-[#9b4a32]">
                La sesión está activa, pero esta cuenta no tiene rol de administración o edición.
              </p>
            )}

            <button
              type="submit"
              disabled={submitting}
              className="inline-flex w-full items-center justify-center gap-3 rounded-full bg-[#1f2a26] px-6 py-3.5 text-[0.68rem] font-medium tracking-[0.18em] text-[#f4efdf] uppercase transition hover:bg-[#33504a] disabled:opacity-50"
            >
              {submitting ? 'Verificando…' : 'Ingresar al panel'}
              <Icon name="arrow-right" size={14} />
            </button>
          </form>

          <p className="mt-8 border-t border-[#25342e]/10 pt-5 text-[0.7rem] leading-relaxed text-[#7d8a82]">
            ¿Necesitas acceso? Solicita a un administrador que cree tu cuenta y asigne tu rol
            (administrador o editor).
          </p>
        </div>
      </div>
    </div>
  )
}
