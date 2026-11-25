import { Link, Navigate, useLocation } from 'react-router-dom'
import { useAuth } from '../context/auth-context'
import SetupNotice from '../pages/admin/setup-notice'
import { Icon } from '../components/common/icons'

export default function RequireStaff({ children }) {
  const { user, loading, isEditor, configured, profileError, signOut } = useAuth()
  const location = useLocation()

  if (!configured) return <SetupNotice />

  if (loading) {
    return (
      <div className="grid min-h-screen place-items-center bg-[#f4efdf]">
        <div className="text-center">
          <span className="mx-auto block h-8 w-8 animate-spin rounded-full border-2 border-[#25342e]/15 border-t-[#547972]" />
          <p className="mt-4 font-mono text-[0.6rem] uppercase tracking-[0.24em] text-[#5f6d66]">
            Verificando sesión
          </p>
        </div>
      </div>
    )
  }

  if (!user) {
    return <Navigate to="/admin/login" state={{ from: location.pathname }} replace />
  }

  if (!isEditor) {
    return (
      <div className="grid min-h-screen place-items-center bg-[#f4efdf] p-6 text-[#25342e]">
        <div className="w-full max-w-lg border border-[#25342e]/10 bg-white p-8 text-center">
          <span className="mx-auto grid h-12 w-12 place-items-center rounded-full bg-[#9b4a32]/10 text-[#9b4a32]">
            <Icon name="lock" size={22} />
          </span>
          <h1 className="mt-5 font-display text-3xl">Acceso restringido</h1>
          <p className="mt-3 text-sm leading-relaxed text-[#44544d]">
            {profileError ||
              'Tu cuenta no tiene permisos de administración o edición. Solicita acceso al administrador de la iglesia.'}
          </p>
          <p className="mt-3 font-mono text-[0.65rem] text-[#5f6d66]">{user.email}</p>

          <div className="mt-7 flex flex-wrap justify-center gap-3">
            <button
              type="button"
              onClick={signOut}
              className="rounded-full bg-[#25342e] px-6 py-3 text-[0.65rem] font-medium uppercase tracking-[0.18em] text-[#f4efdf]"
            >
              Cerrar sesión
            </button>
            <Link
              to="/"
              className="rounded-full border border-[#25342e]/20 px-6 py-3 text-[0.65rem] font-medium uppercase tracking-[0.18em]"
            >
              Ir al sitio
            </Link>
          </div>
        </div>
      </div>
    )
  }

  return children
}
