import { Link, useNavigate } from 'react-router-dom'
import { AdminPageHeader, AdminCard, AdminButton } from '../../components/admin/admin-page'
import { Icon } from '../../components/common/icons'
import { useCollection } from '../../hooks/use-collection'
import { useAuth } from '../../context/auth-context'
import { firebaseConfig, isFirebaseConfigured } from '../../lib/firebase'
import { formatShortDate, isUpcoming } from '../../utils/dates'

export default function Dashboard() {
  const { profile, isAdmin } = useAuth()
  const navigate = useNavigate()

  const { items: events, loading: eventsLoading } = useCollection('events', {
    enabled: isAdmin,
    order: ['fecha', 'desc'],
    fallback: [],
  })
  const { items: ministries } = useCollection('ministries', {
    enabled: isAdmin,
    order: ['orden', 'asc'],
    fallback: [],
  })
  const { items: ads } = useCollection('advertising', {
    order: ['orden', 'asc'],
    fallback: [],
  })
  const { items: messages, loading: messagesLoading } = useCollection('contact_messages', {
    enabled: isAdmin,
    order: ['fecha', 'desc'],
    limit: 50,
    fallback: [],
  })

  const published = events.filter((event) => event.estado === 'publicado')
  const upcoming = events.filter((event) => isUpcoming(event.fecha)).length
  const newMessages = messages.filter((message) => message.estado === 'nuevo').length
  const publishedAds = ads.filter((ad) => ad.estado === 'publicado').length
  const draftAds = ads.filter((ad) => ad.estado !== 'publicado').length

  const stats = isAdmin
    ? [
        {
          label: 'Eventos publicados',
          value: eventsLoading ? '—' : published.length,
          hint: `${upcoming} próximos en agenda`,
          icon: 'calendar',
          to: '/admin/eventos',
        },
        {
          label: 'Ministerios',
          value: ministries.length,
          hint: 'Con identidad propia',
          icon: 'users',
          to: '/admin/ministerios',
        },
        {
          label: 'Anuncios publicados',
          value: publishedAds,
          hint: `${draftAds} en borrador`,
          icon: 'megaphone',
          to: '/admin/publicidad',
        },
        {
          label: 'Registros nuevos',
          value: messagesLoading ? '—' : newMessages,
          hint: `${messages.length} registros en Firestore`,
          icon: 'table',
          to: '/admin/registros',
        },
      ]
    : [
        {
          label: 'Anuncios publicados',
          value: publishedAds,
          hint: 'Visibles en la página pública',
          icon: 'megaphone',
          to: '/admin/publicidad',
        },
        {
          label: 'Borradores',
          value: draftAds,
          hint: 'Pendientes de publicar',
          icon: 'sparkle',
          to: '/admin/publicidad',
        },
        {
          label: 'Total de anuncios',
          value: ads.length,
          hint: 'Creados desde el panel',
          icon: 'gallery',
          to: '/admin/publicidad',
        },
      ]

  const recentMessages = messages.slice(0, 4)

  return (
    <div className="space-y-8">
      <AdminPageHeader
        eyebrow={isAdmin ? 'Panel de administración' : 'Panel de publicidad'}
        title={`Bienvenido${profile?.nombre ? `, ${profile.nombre.split(' ')[0]}` : ''}`}
        description={
          isAdmin
            ? 'Desde aquí se actualiza lo que la iglesia publica en el sitio. Los cambios se reflejan en tiempo real.'
            : 'Gestiona los anuncios, banners y promociones que aparecen en el sitio. Los cambios se publican al instante.'
        }
        action={
          <Link
            to={isAdmin ? '/admin/eventos' : '/admin/publicidad'}
            className="inline-flex items-center gap-2 rounded-full bg-[#1f2a26] px-5 py-2.5 text-[0.65rem] font-medium uppercase tracking-[0.16em] text-[#f4efdf]"
          >
            <Icon name="plus" size={14} />
            {isAdmin ? 'Nuevo evento' : 'Nuevo anuncio'}
          </Link>
        }
      />

      <div className={`grid gap-4 sm:grid-cols-2 ${isAdmin ? 'lg:grid-cols-4' : 'lg:grid-cols-3'}`}>
        {stats.map((stat) => (
          <Link
            key={stat.label}
            to={stat.to}
            className="group border border-[#25342e]/10 bg-white p-5 transition hover:border-[#25342e]/25"
          >
            <div className="flex items-start justify-between">
              <span className="grid h-10 w-10 place-items-center rounded-full bg-[#25342e]/5 text-[#547972]">
                <Icon name={stat.icon} size={18} />
              </span>
              <Icon
                name="arrow-up-right"
                size={15}
                className="text-[#a7ba9f] transition group-hover:text-[#1f2a26]"
              />
            </div>
            <p className="mt-6 font-display text-4xl leading-none text-[#1f2a26]">{stat.value}</p>
            <p className="mt-2 text-[0.72rem] font-medium uppercase tracking-[0.12em] text-[#55645d]">
              {stat.label}
            </p>
            <p className="mt-1 text-[0.7rem] text-[#7d8a82]">{stat.hint}</p>
          </Link>
        ))}
      </div>

      <div className={`grid gap-6 ${isAdmin ? 'lg:grid-cols-[1.35fr_0.65fr]' : 'lg:grid-cols-[1fr_0.6fr]'}`}>
        {isAdmin ? (
          <AdminCard>
            <div className="flex items-center justify-between border-b border-[#25342e]/10 px-5 py-4">
              <div>
                <h2 className="font-display text-xl text-[#1f2a26]">Mensajes recientes</h2>
                <p className="text-[0.7rem] text-[#7d8a82]">
                  Enviados desde el formulario de contacto
                </p>
              </div>
              <Link
                to="/admin/mensajes"
                className="font-mono text-[0.55rem] uppercase tracking-[0.16em] text-[#547972] hover:text-[#1f2a26]"
              >
                Ver todos
              </Link>
            </div>

            {recentMessages.length > 0 ? (
              <ul className="divide-y divide-[#25342e]/8">
                {recentMessages.map((message) => (
                  <li key={message.id}>
                    <Link
                      to="/admin/mensajes"
                      className="flex items-start justify-between gap-4 px-5 py-4 transition hover:bg-[#faf7ea]"
                    >
                      <div className="min-w-0">
                        <p className="flex items-center gap-2 text-sm font-medium text-[#25342e]">
                          {message.nombre}
                          {message.estado === 'nuevo' && (
                            <span className="rounded-full bg-[#e6c9a1]/25 px-2 py-0.5 text-[0.5rem] uppercase tracking-[0.14em] text-[#547972]">
                              Nuevo
                            </span>
                          )}
                        </p>
                        <p className="mt-1 truncate text-xs text-[#55645d]">{message.asunto}</p>
                        <p className="mt-1 line-clamp-1 text-xs text-[#7d8a82]">{message.mensaje}</p>
                      </div>
                      <span className="shrink-0 font-mono text-[0.55rem] text-[#7d8a82]">
                        {formatShortDate(message.fecha)}
                      </span>
                    </Link>
                  </li>
                ))}
              </ul>
            ) : (
              <div className="px-5 py-10 text-center text-sm text-[#7d8a82]">
                Todavía no hay mensajes. Cuando alguien escriba desde el sitio, aparecerá aquí.
              </div>
            )}
          </AdminCard>
        ) : (
          <AdminCard className="p-6">
            <h2 className="font-display text-xl text-[#1f2a26]">Publicidad del sitio</h2>
            <p className="mt-2 text-sm leading-relaxed text-[#55645d]">
              Los anuncios publicados aparecen en la página de inicio. Puedes cambiar el texto, la
              imagen, el enlace y el orden, u ocultar un anuncio sin eliminarlo.
            </p>
            <div className="mt-5 grid gap-2">
              <AdminButton icon="megaphone" onClick={() => navigate('/admin/publicidad')}>
                Gestionar anuncios
              </AdminButton>
              <AdminButton variant="outline" icon="external" onClick={() => navigate('/')}>
                Ver el sitio
              </AdminButton>
            </div>
          </AdminCard>
        )}

        <div className="space-y-6">
          <AdminCard className="p-5">
            <h2 className="font-display text-xl text-[#1f2a26]">Conexión</h2>
            <p className="mt-1 text-[0.7rem] text-[#7d8a82]">
              Estado de la configuración de Firebase.
            </p>

            <dl className="mt-5 space-y-3 text-xs">
              <div className="flex items-center justify-between gap-3">
                <dt className="text-[#7d8a82]">Firebase</dt>
                <dd
                  className={`inline-flex items-center gap-1.5 ${
                    isFirebaseConfigured ? 'text-[#3f6b52]' : 'text-[#9b4a32]'
                  }`}
                >
                  <span
                    className={`h-1.5 w-1.5 rounded-full ${
                      isFirebaseConfigured ? 'bg-[#3f6b52]' : 'bg-[#9b4a32]'
                    }`}
                  />
                  {isFirebaseConfigured ? 'Configurado' : 'Sin configurar'}
                </dd>
              </div>
              <div className="flex items-center justify-between gap-3">
                <dt className="text-[#7d8a82]">Proyecto</dt>
                <dd className="truncate font-mono text-[0.65rem] text-[#44544d]">
                  {firebaseConfig.projectId || '—'}
                </dd>
              </div>
              <div className="flex items-center justify-between gap-3">
                <dt className="text-[#7d8a82]">Tu rol</dt>
                <dd className="font-mono text-[0.65rem] text-[#44544d]">{profile?.rol || '—'}</dd>
              </div>
            </dl>
          </AdminCard>

          <AdminCard className="p-5">
            <h2 className="font-display text-xl text-[#1f2a26]">Acciones rápidas</h2>
            <div className="mt-4 grid gap-2">
              <AdminButton
                variant="outline"
                icon="megaphone"
                onClick={() => navigate('/admin/publicidad')}
              >
                Gestionar publicidad
              </AdminButton>
              {isAdmin && (
                <>
                  <AdminButton
                    variant="outline"
                    icon="calendar"
                    onClick={() => navigate('/admin/eventos')}
                  >
                    Gestionar eventos
                  </AdminButton>
                  <AdminButton
                    variant="outline"
                    icon="gallery"
                    onClick={() => navigate('/admin/galeria')}
                  >
                    Subir fotografías
                  </AdminButton>
                </>
              )}
            </div>
          </AdminCard>
        </div>
      </div>
    </div>
  )
}
