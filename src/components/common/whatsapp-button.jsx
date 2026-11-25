import { useSettings } from '../../context/settings-context'
import { Icon } from './icons'

export default function WhatsAppButton() {
  const { settings } = useSettings()
  const digits = (settings.whatsapp || '').replace(/[^\d]/g, '')

  if (!digits) return null

  const message = encodeURIComponent(
    'Hola, me gustaría recibir información sobre Asambleas de Dios Getsemaní.',
  )

  return (
    <a
      href={`https://wa.me/${digits}?text=${message}`}
      target="_blank"
      rel="noreferrer noopener"
      aria-label="Escríbenos por WhatsApp"
      className="fixed bottom-5 left-5 z-[80] grid h-11 w-11 place-items-center rounded-full border border-white/15 bg-[#1d6b4a] text-white shadow-lg transition-transform duration-300 hover:-translate-y-1 sm:bottom-7 sm:left-7 sm:h-12 sm:w-12"
    >
      <Icon name="whatsapp" size={21} />
    </a>
  )
}
