import Hero from '../../components/sections/hero'
import Statement from '../../components/sections/statement'
import ExpandMedia from '../../components/common/expand-media'
import ServiceTimes from '../../components/sections/service-times'
import MinistriesPreview from '../../components/sections/ministries-preview'
import UpcomingEvents from '../../components/sections/upcoming-events'
import HistoryTeaser from '../../components/sections/history-teaser'
import CommunityGallery from '../../components/sections/community-gallery'
import AdvertisingAlbum from '../../components/sections/advertising-album'
import ContactCTA from '../../components/sections/contact-cta'
import { useCollection } from '../../hooks/use-collection'
import { DEFAULT_EVENTS, DEFAULT_MINISTRIES } from '../../data/content'

export default function Home() {
  const { items: ministries } = useCollection('ministries', {
    published: true,
    order: ['orden', 'asc'],
    fallback: DEFAULT_MINISTRIES,
  })

  const { items: events, loading } = useCollection('events', {
    published: true,
    order: ['fecha', 'asc'],
    fallback: DEFAULT_EVENTS,
  })

  return (
    <>
      <Hero />
      <Statement />

      <ExpandMedia
        image="/images/horizontal/horizontal-alabanza.jpg"
        alt="La congregación adorando en el templo"
        eyebrow="Un mismo corazón"
        title={
          <>
            Fe que se comparte,
            <br />
            <em className="text-gold italic">esperanza que se vive.</em>
          </>
        }
        caption="No caminamos solos. Cada reunión es una oportunidad para recordar que Dios sigue escribiendo historias en medio de su pueblo."
      />

      <ServiceTimes />
      <MinistriesPreview ministries={ministries} />
      <UpcomingEvents events={events} loading={loading} />
      <CommunityGallery />
      <AdvertisingAlbum />
      <HistoryTeaser />
      <ContactCTA />
    </>
  )
}
