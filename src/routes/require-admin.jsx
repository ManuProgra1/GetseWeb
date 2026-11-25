import { Link } from 'react-router-dom'
import { useAuth } from '../context/auth-context'
import { Icon } from '../components/common/icons'

/** Restringe una ruta al rol administrador. La regla de Firestore es la que manda. */
export default function RequireAdmin({ children }) {
  const { isAdmin, profileError } = useAuth()

  if (!isAdmin) {
    return (
      <div className="mx-auto max-w-xl border border-[#9b4a32]/25 bg-[#9b4a32]/5 p-8 text-center">
        <span className="mx-auto grid h-12 w-12 place-items-center rounded-full bg-[#9b4a32]/10 text-[#9b4a32]">
          <Icon name="lock" size={22} />
        </span>
        <p className="mt-4 font-display text-2xl text-[#1f2a26]">Solo administradores</p>
        <p className="mt-2 text-sm leading-relaxed text-[#55645d]">
          {profileError ||
            'Esta sección está reservada al rol administrador. Los editores de publicidad solo pueden gestionar anuncios y banners.'}
        </p>
        <Link
          to="/admin"
          className="mt-6 inline-flex items-center gap-2 rounded-full bg-[#1f2a26] px-5 py-2.5 text-[0.65rem] font-medium uppercase tracking-[0.16em] text-[#f4efdf]"
        >
          <Icon name="arrow-left" size={14} />
          Volver al panel
        </Link>
      </div>
    )
  }

  return children
}
