import { Link } from 'react-router-dom'
import Logo from '../common/logo'
import { Icon } from '../common/icons'
import { useSettings } from '../../context/settings-context'
import { CHURCH } from '../../data/content'

const SOCIALS = [
  { key: 'facebook', label: 'Facebook', icon: 'facebook' },
  { key: 'instagram', label: 'Instagram', icon: 'instagram' },
  { key: 'youtube', label: 'YouTube', icon: 'youtube' },
  { key: 'tiktok', label: 'TikTok', icon: 'external' },
]

const NAV = [
  { to: '/nosotros', label: 'Nosotros' },
  { to: '/historia', label: 'Nuestra historia' },
  { to: '/ministerios', label: 'Ministerios' },
  { to: '/eventos', label: 'Eventos' },
  { to: '/contacto', label: 'Contacto' },
]

export default function Footer() {
  const { settings } = useSettings()
  const socials = SOCIALS.filter((social) => settings.redesSociales?.[social.key])
  const year = new Date().getFullYear()

  return (
    <footer className="relative overflow-hidden border-t border-bone/10 bg-ink pt-16 sm:pt-20">
      <div className="shell">
        <div className="grid gap-12 lg:grid-cols-[1.4fr_0.7fr_1fr_1fr]">
          <div>
            <Logo className="text-bone" size="lg" />
            <p className="mt-6 max-w-xs text-sm leading-relaxed text-bone/55">
              {settings.descripcion}
            </p>
            <p className="mt-6 max-w-xs border-l border-gold/40 pl-4 font-display text-lg leading-snug text-bone/75 italic">
              “{CHURCH.verse.text}”
              <span className="mt-2 block font-sans text-[0.62rem] tracking-[0.2em] text-gold/80 uppercase not-italic">
                {CHURCH.verse.reference}
              </span>
            </p>
            {socials.length > 0 && (
              <div className="mt-7 flex gap-2.5">
                {socials.map((social) => (
                  <a
                    key={social.key}
                    href={settings.redesSociales[social.key]}
                    target="_blank"
                    rel="noreferrer noopener"
                    aria-label={social.label}
                    className="grid h-10 w-10 place-items-center rounded-full border border-bone/15 text-bone/70 transition hover:border-gold/60 hover:text-gold"
                  >
                    <Icon name={social.icon} size={16} />
                  </a>
                ))}
              </div>
            )}
          </div>

          <div>
            <h3 className="eyebrow text-bone/40">Explorar</h3>
            <ul className="mt-5 space-y-2.5 text-sm">
              {NAV.map((item) => (
                <li key={item.to}>
                  <Link to={item.to} className="text-bone/65 transition hover:text-gold">
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h3 className="eyebrow text-bone/40">Reuniones</h3>
            <ul className="mt-5 space-y-3 text-sm">
              {settings.horarios.map((item) => (
                <li key={`${item.dia}-${item.hora}`} className="flex flex-col">
                  <span className="text-bone/85">{item.dia}</span>
                  <span className="font-mono text-[0.68rem] tracking-wide text-gold/80">
                    {item.hora}
                  </span>
                  {item.detalle && <span className="text-xs text-bone/40">{item.detalle}</span>}
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h3 className="eyebrow text-bone/40">Contacto</h3>
            <ul className="mt-5 space-y-3 text-sm text-bone/65">
              <li className="flex gap-3">
                <Icon name="map-pin" size={16} className="mt-0.5 shrink-0 text-gold/70" />
                <span>{settings.direccion || 'Dirección por confirmar'}</span>
              </li>
              {settings.telefono && (
                <li className="flex gap-3">
                  <Icon name="phone" size={16} className="mt-0.5 shrink-0 text-gold/70" />
                  <a href={`tel:${settings.telefono.replace(/\s/g, '')}`} className="hover:text-gold">
                    {settings.telefono}
                  </a>
                </li>
              )}
              {settings.correo && (
                <li className="flex gap-3">
                  <Icon name="mail" size={16} className="mt-0.5 shrink-0 text-gold/70" />
                  <a href={`mailto:${settings.correo}`} className="hover:text-gold">
                    {settings.correo}
                  </a>
                </li>
              )}
              <li className="pt-2">
                <Link
                  to="/contacto"
                  className="inline-flex items-center gap-2 text-[0.7rem] tracking-[0.16em] text-gold uppercase"
                >
                  Escríbenos <Icon name="arrow-up-right" size={14} />
                </Link>
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-16 flex flex-col gap-4 border-t border-bone/10 py-6 text-[0.7rem] text-bone/35 sm:flex-row sm:items-center sm:justify-between">
          <p>
            © {year} {CHURCH.name}. Todos los derechos reservados.
          </p>
          <div className="flex items-center gap-6">
            <span>{settings.lema}</span>
            <Link to="/admin/login" className="transition hover:text-gold">
              Administración
            </Link>
          </div>
        </div>
      </div>

    </footer>
  )
}
