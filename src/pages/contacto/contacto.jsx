import PageHero from '../../components/common/page-hero'
import ContactForm from '../../components/sections/contact-form'
import AdBanner from '../../components/sections/ad-banner'
import Reveal from '../../components/common/reveal'
import Button from '../../components/common/button'
import { Icon } from '../../components/common/icons'
import { useSettings } from '../../context/settings-context'

const SOCIALS = [
  { key: 'facebook', label: 'Facebook', icon: 'facebook' },
  { key: 'instagram', label: 'Instagram', icon: 'instagram' },
  { key: 'youtube', label: 'YouTube', icon: 'youtube' },
  { key: 'tiktok', label: 'TikTok', icon: 'external' },
]

export default function Contacto() {
  const { settings } = useSettings()
  const socials = SOCIALS.filter((social) => settings.redesSociales?.[social.key])
  const whatsapp = (settings.whatsapp || '').replace(/[^\d]/g, '')

  const info = [
    {
      icon: 'map-pin',
      label: 'Dirección',
      value: settings.direccion || 'Dirección por confirmar',
      href: settings.mapaUrl || undefined,
    },
    {
      icon: 'phone',
      label: 'Teléfono',
      value: settings.telefono || 'Teléfono por confirmar',
      href: settings.telefono ? `tel:${settings.telefono.replace(/\s/g, '')}` : undefined,
    },
    {
      icon: 'mail',
      label: 'Correo',
      value: settings.correo || 'Correo por confirmar',
      href: settings.correo ? `mailto:${settings.correo}` : undefined,
    },
  ]

  return (
    <>
      <PageHero
        eyebrow="Contacto"
        title={
          <>
            Nos encantaría <em className="text-gold italic">conocerte</em>
          </>
        }
        lead="Escríbenos, visítanos un domingo o pregúntanos cómo puedes formar parte de esta familia."
        image="/images/horizontal/horizontal-iglesia.jpg"
        imageAlt="Interior del templo de Asambleas de Dios Getsemaní durante un culto"
        meta={[
          { label: 'Reuniones', value: settings.horarios[0] ? `${settings.horarios[0].dia} · ${settings.horarios[0].hora}` : 'Domingo' },
          { label: 'Ubicación', value: settings.direccion || 'Guatemala' },
        ]}
      />

      <section className="bg-bone py-16 text-ink sm:py-24">
        <div className="shell grid gap-12 lg:grid-cols-[0.85fr_1.15fr] lg:gap-16">
          <div>
            <Reveal as="p" className="eyebrow text-pine">
              Información
            </Reveal>

            <h2 className="display mt-5 max-w-[16ch] text-[clamp(1.9rem,3.6vw,3rem)]">
              Hablemos. Estamos para servirte.
            </h2>

            <div className="mt-9 space-y-3">
              {info.map((item, index) => {
                const content = (
                  <>
                    <span
                      className={`grid h-11 w-11 shrink-0 place-items-center rounded-full ${
                        ['bg-pine/10 text-pine', 'bg-berry/10 text-berry', 'bg-mist/25 text-[#4c7480]'][
                          index % 3
                        ]
                      }`}
                    >
                      <Icon name={item.icon} size={18} />
                    </span>
                    <div>
                      <p className="font-mono text-[0.55rem] uppercase tracking-[0.18em] text-ink/55">
                        {item.label}
                      </p>
                      <p className="mt-1 text-sm text-ink/80">{item.value}</p>
                    </div>
                  </>
                )

                return (
                  <Reveal key={item.label} delay={index * 0.06}>
                    {item.href ? (
                      <a
                        href={item.href}
                        target={item.href.startsWith('http') ? '_blank' : undefined}
                        rel="noreferrer noopener"
                        className="flex items-center gap-4 border border-ink/10 bg-[#faf7ea] p-4 transition hover:border-ink/25"
                      >
                        {content}
                      </a>
                    ) : (
                      <div className="flex items-center gap-4 border border-ink/10 bg-[#faf7ea] p-4">
                        {content}
                      </div>
                    )}
                  </Reveal>
                )
              })}
            </div>

            <Reveal className="mt-10" delay={0.1}>
              <p className="eyebrow text-pine">Horarios de reunión</p>
              <ul className="mt-4 divide-y divide-ink/10 border-y border-ink/10">
                {settings.horarios.map((item) => (
                  <li key={`${item.dia}-${item.hora}`} className="flex items-baseline justify-between gap-4 py-3">
                    <span className="text-sm text-ink/75">{item.dia}</span>
                    <span className="font-mono text-[0.68rem] text-ink/60">{item.hora}</span>
                  </li>
                ))}
              </ul>
            </Reveal>

            {socials.length > 0 && (
              <Reveal className="mt-9" delay={0.14}>
                <p className="eyebrow text-pine">Síguenos</p>
                <div className="mt-4 flex flex-wrap gap-2.5">
                  {socials.map((social) => (
                    <a
                      key={social.key}
                      href={settings.redesSociales[social.key]}
                      target="_blank"
                      rel="noreferrer noopener"
                      className="inline-flex items-center gap-2 border border-ink/15 px-3.5 py-2 text-xs text-ink/65 transition hover:border-ink/40 hover:text-ink"
                    >
                      <Icon name={social.icon} size={14} />
                      {social.label}
                    </a>
                  ))}
                </div>
              </Reveal>
            )}

            {whatsapp && (
              <Reveal className="mt-8" delay={0.18}>
                <Button
                  href={`https://wa.me/${whatsapp}`}
                  variant="outlineDark"
                  size="sm"
                  icon="whatsapp"
                  iconPosition="left"
                >
                  Escribir por WhatsApp
                </Button>
              </Reveal>
            )}
          </div>

          <Reveal delay={0.08} y={24}>
            <ContactForm />
          </Reveal>
        </div>
      </section>

      <AdBanner placement="contacto" />

      <section className="bg-ink py-16 sm:py-20">
        <div className="shell">
          <div className="flex flex-wrap items-end justify-between gap-4">
            <div>
              <Reveal as="p" className="eyebrow text-gold/80">
                Ubicación
              </Reveal>
              <h2 className="display mt-4 text-[clamp(1.8rem,3.4vw,2.8rem)] text-bone">
                Encuéntranos
              </h2>
            </div>
            <p className="max-w-sm text-xs leading-relaxed text-bone/35">
              {settings.mapaUrl
                ? 'El mapa se actualiza con la dirección oficial de la iglesia.'
                : 'La dirección oficial y el mapa se habilitarán en cuanto la iglesia los proporcione.'}
            </p>
          </div>

          <Reveal className="mt-8">
            {settings.mapaUrl ? (
              <div className="overflow-hidden border border-bone/10">
                <iframe
                  title="Ubicación de Asambleas de Dios Getsemaní"
                  src={settings.mapaUrl}
                  loading="lazy"
                  referrerPolicy="no-referrer-when-downgrade"
                  allowFullScreen
                  className="h-[380px] w-full grayscale-[0.35] contrast-[1.05] sm:h-[460px]"
                />
              </div>
            ) : (
              <div
                className="relative flex h-[320px] flex-col items-center justify-center overflow-hidden border border-bone/10 sm:h-[420px]"
                style={{
                  backgroundImage:
                    'linear-gradient(rgba(254,253,240,0.04) 1px, transparent 1px), linear-gradient(90deg, rgba(254,253,240,0.04) 1px, transparent 1px)',
                  backgroundSize: '56px 56px',
                }}
              >
                <span className="grid h-16 w-16 place-items-center rounded-full border border-gold/30 bg-ink/60 text-gold">
                  <Icon name="map-pin" size={26} />
                </span>
                <p className="mt-5 font-display text-2xl text-bone/80">
                  Dirección por confirmar
                </p>
                <p className="mt-2 max-w-sm px-6 text-center text-xs leading-relaxed text-bone/40">
                  La iglesia habilitará aquí el mapa oficial de Google Maps cuando la
                  dirección esté registrada en el panel administrativo.
                </p>
              </div>
            )}
          </Reveal>
        </div>
      </section>
    </>
  )
}
