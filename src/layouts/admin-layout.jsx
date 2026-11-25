import { useEffect, useState } from 'react'
import { Link, NavLink, Outlet, useLocation, useNavigate } from 'react-router-dom'
import Logo from '../components/common/logo'
import { Icon } from '../components/common/icons'
import { useAuth } from '../context/auth-context'

const NAV = [
  {
    group: 'Dashboard',
    items: [{ to: '/admin', label: 'Resumen', icon: 'layout', end: true }],
  },
  {
    group: 'Gestión de publicidad',
    items: [{ to: '/admin/publicidad', label: 'Anuncios y banners', icon: 'sparkle' }],
  },
  {
    group: 'Gestión de contenido',
    adminOnly: true,
    items: [
      { to: '/admin/eventos', label: 'Eventos', icon: 'calendar' },
      { to: '/admin/ministerios', label: 'Ministerios', icon: 'users' },
      { to: '/admin/historia', label: 'Historia', icon: 'history' },
    ],
  },
  {
    group: 'Gestión de imágenes',
    adminOnly: true,
    items: [{ to: '/admin/galeria', label: 'Galería', icon: 'gallery' }],
  },
  {
    group: 'Gestión de registros',
    adminOnly: true,
    items: [{ to: '/admin/registros', label: 'Registros de formularios', icon: 'table' }],
  },
  {
    group: 'Gestión de formularios',
    adminOnly: true,
    items: [{ to: '/admin/mensajes', label: 'Mensajes recibidos', icon: 'message' }],
  },
  {
    group: 'Gestión de usuarios',
    adminOnly: true,
    items: [{ to: '/admin/usuarios', label: 'Usuarios y roles', icon: 'lock' }],
  },
  {
    group: 'Configuración general',
    adminOnly: true,
    items: [{ to: '/admin/configuracion', label: 'Configuración', icon: 'settings' }],
  },
]

const TITLES = {
  '/admin': 'Resumen',
  '/admin/eventos': 'Eventos',
  '/admin/ministerios': 'Ministerios',
  '/admin/historia': 'Historia',
  '/admin/galeria': 'Galería',
  '/admin/publicidad': 'Gestión de publicidad',
  '/admin/registros': 'Gestión de registros',
  '/admin/mensajes': 'Mensajes recibidos',
  '/admin/configuracion': 'Configuración',
  '/admin/usuarios': 'Usuarios y roles',
}

function SidebarContent({ onNavigate }) {
  const { profile, user, isAdmin, signOut } = useAuth()
  const navigate = useNavigate()

  const handleSignOut = async () => {
    await signOut()
    navigate('/admin/login')
  }

  return (
    <>
      <div className="border-b border-white/10 px-5 py-6">
        <Logo className="text-bone" />
        <p className="mt-4 font-mono text-[0.55rem] uppercase tracking-[0.24em] text-gold/70">
          Panel de contenido
        </p>
      </div>

      <nav className="flex-1 overflow-y-auto px-3 py-5" aria-label="Panel administrativo">
        {NAV.filter((group) => !group.adminOnly || isAdmin).map((group) => (
          <div key={group.group} className="mb-5">
            <p className="px-3 font-mono text-[0.52rem] uppercase tracking-[0.22em] text-bone/30">
              {group.group}
            </p>
            <ul className="mt-2 space-y-0.5">
              {group.items.map((item) => (
                <li key={item.to}>
                  <NavLink
                    to={item.to}
                    end={item.end}
                    onClick={onNavigate}
                    className={({ isActive }) =>
                      `flex items-center gap-3 rounded px-3 py-2.5 text-[0.8rem] transition ${
                        isActive
                          ? 'bg-gold/15 text-gold'
                          : 'text-bone/60 hover:bg-white/5 hover:text-bone'
                      }`
                    }
                  >
                    <Icon name={item.icon} size={16} />
                    {item.label}
                  </NavLink>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </nav>

      <div className="border-t border-white/10 p-4">
        <div className="flex items-center gap-3">
          <span className="grid h-9 w-9 place-items-center rounded-full bg-gold/20 font-mono text-[0.6rem] text-gold">
            {(profile?.nombre || user?.email || 'AD').slice(0, 2).toUpperCase()}
          </span>
          <div className="min-w-0 flex-1">
            <p className="truncate text-xs text-bone/85">{profile?.nombre || user?.email}</p>
            <p className="font-mono text-[0.52rem] uppercase tracking-[0.16em] text-gold/60">
              {profile?.rol || 'sin rol'}
            </p>
          </div>
          <button
            type="button"
            onClick={handleSignOut}
            aria-label="Cerrar sesión"
            title="Cerrar sesión"
            className="grid h-8 w-8 place-items-center rounded-full border border-white/15 text-bone/60 transition hover:border-gold/50 hover:text-gold"
          >
            <Icon name="logout" size={14} />
          </button>
        </div>
      </div>
    </>
  )
}

export default function AdminLayout() {
  const [menuOpen, setMenuOpen] = useState(false)
  const { pathname } = useLocation()
  const { profile } = useAuth()

  useEffect(() => {
    setMenuOpen(false)
  }, [pathname])

  return (
    <div className="min-h-screen bg-[#f4efdf] text-[#25342e]">
      <aside className="fixed inset-y-0 left-0 z-40 hidden w-64 flex-col bg-[#16201c] text-bone lg:flex">
        <SidebarContent />
      </aside>

      {menuOpen && (
        <div className="fixed inset-0 z-[300] lg:hidden">
          <button
            type="button"
            aria-label="Cerrar menú"
            onClick={() => setMenuOpen(false)}
            className="absolute inset-0 bg-[#101a16]/60 backdrop-blur-sm"
          />
          <aside className="absolute inset-y-0 left-0 flex w-72 flex-col bg-[#16201c] text-bone">
            <SidebarContent onNavigate={() => setMenuOpen(false)} />
          </aside>
        </div>
      )}

      <div className="lg:pl-64">
        <header className="sticky top-0 z-30 flex items-center justify-between gap-4 border-b border-[#25342e]/10 bg-[#f4efdf]/90 px-4 py-3 backdrop-blur-md sm:px-7">
          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={() => setMenuOpen(true)}
              aria-label="Abrir menú"
              className="grid h-9 w-9 place-items-center rounded-full border border-[#25342e]/15 text-[#25342e] lg:hidden"
            >
              <Icon name="menu" size={16} />
            </button>
            <div>
              <p className="font-mono text-[0.52rem] uppercase tracking-[0.22em] text-[#7d8a82]">
                Administración
              </p>
              <p className="font-display text-lg leading-tight text-[#1f2a26]">
                {TITLES[pathname] || 'Panel'}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <span className="hidden rounded-full bg-[#25342e]/5 px-3 py-1.5 font-mono text-[0.55rem] uppercase tracking-[0.16em] text-[#55645d] sm:inline">
              {profile?.rol || 'sin rol'}
            </span>
            <Link
              to="/"
              className="inline-flex items-center gap-2 rounded-full border border-[#25342e]/15 px-3.5 py-2 text-[0.6rem] font-medium uppercase tracking-[0.14em] transition hover:border-[#25342e]/40"
            >
              <Icon name="external" size={13} />
              Ver sitio
            </Link>
          </div>
        </header>

        <main className="mx-auto w-full max-w-6xl px-4 py-7 sm:px-7 sm:py-9">
          <Outlet />
        </main>
      </div>
    </div>
  )
}
