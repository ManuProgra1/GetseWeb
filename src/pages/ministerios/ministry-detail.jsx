import { useEffect, useMemo, useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import Reveal from '../../components/common/reveal'
import SplitHeading from '../../components/common/split-heading'
import ParallaxImage from '../../components/common/parallax-image'
import Button from '../../components/common/button'
import ContactCTA from '../../components/sections/contact-cta'
import Lightbox from '../../components/common/lightbox'
import { Icon } from '../../components/common/icons'
import { useCollection } from '../../hooks/use-collection'
import { DEFAULT_MINISTRIES } from '../../data/content'
import { initials } from '../../utils/misc'

export default function MinistryDetail() {
  const { slug } = useParams()
  const { items, loading } = useCollection('ministries', {
    published: true,
    order: ['orden', 'asc'],
    fallback: DEFAULT_MINISTRIES,
  })
  const { items: galleryItems } = useCollection('gallery', {
    order: ['fecha', 'desc'],
    fallback: [],
  })

  const ministry = items.find((item) => (item.slug || item.id) === slug)
  const [lightboxIndex, setLightboxIndex] = useState(null)

  const gallery = useMemo(() => {
    if (!ministry) return []
    const fromMinistry = (ministry.galeria || []).map((url, index) => ({
      id: `ministry-${index}`,
      imagen: url,
      titulo: ministry.nombre,
    }))
    const fromCollection = galleryItems
      .filter((item) => {
        const target = (item.ministerio || '').toLowerCase()
        return (
          target === ministry.nombre.toLowerCase() ||
          target === (ministry.slug || ministry.id).toLowerCase()
        )
      })
      .map((item) => ({ ...item, imagen: item.imagen }))
    return [...fromMinistry, ...fromCollection]
  }, [ministry, galleryItems])

  useEffect(() => {
    if (ministry) document.title = `${ministry.nombre} · Asambleas de Dios Getsemaní`
    return () => {
      document.title = 'Asambleas de Dios Getsemaní'
    }
  }, [ministry])

  if (!ministry) {
    return (
      <section className="flex min-h-[80svh] items-center py-32">
        <div className="shell text-center">
          <p className="eyebrow text-gold">Ministerios</p>
          <h1 className="display mt-5 text-[clamp(2.2rem,5vw,4rem)]">
            {loading ? 'Cargando ministerio…' : 'No encontramos este ministerio'}
          </h1>
          <div className="mt-8 flex justify-center">
            <Button to="/ministerios" icon="arrow-left" iconPosition="left">
              Ver todos los ministerios
            </Button>
          </div>
        </div>
      </section>
    )
  }

  const accent = ministry.acento || '#e6c9a1'
  const otherMinistries = items.filter((item) => item.id !== ministry.id).slice(0, 3)

  return (
    <>
      <section
        className="relative isolate overflow-hidden pt-36 pb-16 sm:pt-44 sm:pb-24"
        style={{
          background: `radial-gradient(80% 70% at 85% 10%, ${accent}22, transparent 62%), linear-gradient(180deg, #16201c 0%, #101a16 100%)`,
        }}
      >
        <div className="shell grid items-center gap-12 lg:grid-cols-[1.25fr_0.75fr]">
          <div>
            <Reveal as="p" className="eyebrow flex items-center gap-3 text-gold" y={10}>
              <Link to="/ministerios" className="transition hover:text-bone">
                Ministerios
              </Link>
              <span className="h-px w-6 bg-gold/50" />
              {ministry.nombre}
            </Reveal>

            <SplitHeading
              as="h1"
              trigger={false}
              delay={0.1}
              className="display mt-6 text-[clamp(2.8rem,7vw,6rem)] text-bone"
            >
              {ministry.nombre}
            </SplitHeading>

            {ministry.lema && (
              <Reveal
                as="p"
                className="mt-4 font-display text-xl italic sm:text-2xl"
                style={{ color: accent }}
                delay={0.2}
              >
                {ministry.lema}
              </Reveal>
            )}

            <Reveal
              as="p"
              className="mt-7 max-w-xl text-sm leading-relaxed text-bone/60 sm:text-base"
              delay={0.25}
            >
              {ministry.descripcion}
            </Reveal>

            <Reveal className="mt-9 flex flex-wrap gap-3" delay={0.3}>
              <Button to="/contacto" size="md">
                Quiero servir
              </Button>
              <Button to="/ministerios" variant="outline" icon="arrow-left" iconPosition="left">
                Todos los ministerios
              </Button>
            </Reveal>
          </div>

          <Reveal className="justify-self-center lg:justify-self-end" delay={0.15}>
            <div className="relative">
              <div
                aria-hidden="true"
                className="absolute -inset-8 rounded-full blur-3xl"
                style={{ background: `${accent}22` }}
              />
              <div
                className="relative grid h-56 w-56 place-items-center overflow-hidden rounded-full border bg-night/60 backdrop-blur-sm sm:h-72 sm:w-72"
                style={{ borderColor: `${accent}44` }}
              >
                {ministry.logo ? (
                  <img
                    src={ministry.logo}
                    alt={ministry.nombre}
                    className="h-full w-full object-cover"
                  />
                ) : (
                  <span className="font-display text-7xl" style={{ color: accent }}>
                    {initials(ministry.nombre)}
                  </span>
                )}
              </div>
              {ministry.pendiente && (
                <p className="mt-5 text-center font-mono text-[0.54rem] uppercase tracking-[0.2em] text-bone/35">
                  Identidad oficial en proceso
                </p>
              )}
            </div>
          </Reveal>
        </div>
      </section>

      <section className="bg-bone py-16 text-ink sm:py-24">
        <div className="shell grid gap-12 lg:grid-cols-[1.1fr_0.9fr] lg:gap-20">
          <div>
            <Reveal as="p" className="eyebrow text-pine">
              Sobre el ministerio
            </Reveal>
            <h2 className="display mt-5 max-w-[18ch] text-[clamp(1.9rem,3.6vw,3rem)]">
              Una identidad propia, un mismo propósito.
            </h2>

            <p className="mt-6 max-w-xl text-sm leading-relaxed text-ink/65 sm:text-base">
              {ministry.descripcion}
            </p>

            {ministry.responsable && (
              <p className="mt-6 inline-flex items-center gap-3 border border-ink/15 px-4 py-3 text-sm text-ink/70">
                <Icon name="users" size={16} className="text-pine" />
                Responsable: {ministry.responsable}
              </p>
            )}
          </div>

          <div className="border-t border-ink/15 pt-6">
            <p className="eyebrow text-pine">Objetivo</p>
            <p className="mt-4 font-display text-2xl leading-snug sm:text-[1.65rem]">
              {ministry.objetivo || (
                <span className="text-ink/60">
                  El objetivo oficial de este ministerio se incorporará próximamente desde el
                  panel administrativo.
                </span>
              )}
            </p>

            {ministry.actividades?.length > 0 && (
              <div className="mt-10">
                <p className="eyebrow text-pine">Actividades</p>
                <ul className="mt-4 space-y-3">
                  {ministry.actividades.map((activity, index) => (
                    <li
                      key={`${activity}-${index}`}
                      className="flex items-start gap-3 border-b border-ink/10 pb-3 text-sm text-ink/65"
                    >
                      <span className="mt-0.5 font-mono text-[0.55rem] text-ink/35">
                        {String(index + 1).padStart(2, '0')}
                      </span>
                      {activity}
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        </div>
      </section>

      <section className="bg-ink py-16 sm:py-24">
        <div className="shell">
          <div className="flex flex-wrap items-end justify-between gap-4">
            <div>
              <Reveal as="p" className="eyebrow text-gold/80">
                Galería
              </Reveal>
              <h2 className="display mt-4 text-[clamp(1.8rem,3.4vw,2.8rem)] text-bone">
                Momentos de {ministry.nombre}
              </h2>
            </div>
            <p className="max-w-xs text-xs text-bone/35">
              Las fotografías se cargan desde el panel administrativo y se actualizan en tiempo real.
            </p>
          </div>

          {gallery.length > 0 ? (
            <div className="mt-10 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
              {gallery.map((item, index) => (
                <button
                  key={item.id || item.imagen}
                  type="button"
                  onClick={() => setLightboxIndex(index)}
                  className="group relative aspect-[4/3] overflow-hidden"
                >
                  <img
                    src={item.imagen}
                    alt={item.titulo || ministry.nombre}
                    loading="lazy"
                    className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-105"
                  />
                  <span className="absolute inset-0 bg-gradient-to-t from-ink/70 via-transparent to-transparent opacity-70 transition group-hover:opacity-100" />
                  <span className="absolute right-4 bottom-4 grid h-8 w-8 place-items-center rounded-full border border-bone/30 text-bone/80 transition group-hover:border-gold group-hover:text-gold">
                    <Icon name="plus" size={14} />
                  </span>
                </button>
              ))}
            </div>
          ) : (
            <Reveal className="mt-10 flex flex-col items-start gap-4 border border-bone/10 p-8 sm:flex-row sm:items-center sm:justify-between">
              <div className="flex items-center gap-4">
                <span className="grid h-12 w-12 place-items-center rounded-full border border-bone/15 text-gold/70">
                  <Icon name="image" size={20} />
                </span>
                <p className="max-w-sm text-sm text-bone/50">
                  Estamos preparando la galería de este ministerio. Las fotografías aparecerán
                  aquí en cuanto sean publicadas.
                </p>
              </div>
              <Button to="/contacto" variant="outline" size="sm" icon="mail">
                Compartir fotos
              </Button>
            </Reveal>
          )}
        </div>
      </section>

      <section className="bg-bone py-16 text-ink sm:py-20">
        <div className="shell">
          <div className="flex items-end justify-between gap-4">
            <h2 className="display text-[clamp(1.7rem,3.2vw,2.4rem)]">Otros ministerios</h2>
            <Link
              to="/ministerios"
              className="font-mono text-[0.6rem] uppercase tracking-[0.2em] text-ink/50 transition hover:text-ink"
            >
              Ver todos
            </Link>
          </div>

          <div className="mt-8 grid gap-px overflow-hidden border border-ink/10 bg-ink/10 sm:grid-cols-3">
            {otherMinistries.map((item) => (
              <Link
                key={item.id}
                to={`/ministerios/${item.slug || item.id}`}
                className="group flex flex-col justify-between gap-8 bg-bone p-6 transition-colors duration-500 hover:bg-[#faf7ea]"
              >
                <div className="flex items-center justify-between">
                  <span
                    className="grid h-10 w-10 place-items-center overflow-hidden rounded-full"
                    style={{ backgroundColor: `${item.acento || '#e6c9a1'}1f` }}
                  >
                    {item.logo ? (
                      <img src={item.logo} alt="" className="h-full w-full object-cover" />
                    ) : (
                      <span
                        className="font-display text-sm"
                        style={{ color: item.acento || '#e6c9a1' }}
                      >
                        {initials(item.nombre)}
                      </span>
                    )}
                  </span>
                  <Icon
                    name="arrow-up-right"
                    size={15}
                    className="text-ink/30 transition group-hover:text-ink"
                  />
                </div>
                <div>
                  <p className="font-display text-2xl leading-none">{item.nombre}</p>
                  <p className="mt-2 line-clamp-2 text-xs text-ink/50">{item.lema}</p>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      <ContactCTA />

      <Lightbox
        items={gallery}
        index={lightboxIndex}
        onClose={() => setLightboxIndex(null)}
        onNavigate={setLightboxIndex}
      />
    </>
  )
}
