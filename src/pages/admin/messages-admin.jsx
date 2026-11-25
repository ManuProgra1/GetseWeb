import { useMemo, useState } from 'react'
import {
  AdminButton,
  AdminCard,
  AdminPageHeader,
  EmptyState,
} from '../../components/admin/admin-page'
import Modal from '../../components/admin/modal'
import ConfirmDialog from '../../components/admin/confirm-dialog'
import { Icon } from '../../components/common/icons'
import { useToast } from '../../context/toast-context'
import { useCollection } from '../../hooks/use-collection'
import { deleteRecord, updateRecord } from '../../services/content'
import { toDate } from '../../utils/dates'

const FILTERS = [
  { key: 'todos', label: 'Todos' },
  { key: 'nuevo', label: 'Nuevos' },
  { key: 'leido', label: 'Leídos' },
  { key: 'archivado', label: 'Archivados' },
]

const STATE_LABEL = {
  nuevo: 'Nuevo',
  leido: 'Leído',
  archivado: 'Archivado',
}

function formatDate(value) {
  const date = toDate(value)
  if (!date) return '—'
  return date.toLocaleString('es-GT', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  })
}

export default function MessagesAdmin() {
  const { items, loading } = useCollection('contact_messages', {
    order: ['fecha', 'desc'],
    fallback: [],
  })
  const { notify } = useToast()

  const [filter, setFilter] = useState('todos')
  const [selected, setSelected] = useState(null)
  const [pendingDelete, setPendingDelete] = useState(null)
  const [deleting, setDeleting] = useState(false)
  const [working, setWorking] = useState(false)

  const filtered = useMemo(
    () => (filter === 'todos' ? items : items.filter((item) => item.estado === filter)),
    [items, filter],
  )

  const unread = items.filter((item) => item.estado === 'nuevo').length

  const openMessage = async (message) => {
    setSelected(message)
    if (message.estado === 'nuevo') {
      try {
        await updateRecord('contact_messages', message.id, { estado: 'leido' })
        setSelected((current) => (current ? { ...current, estado: 'leido' } : current))
      } catch (error) {
        console.error(error)
      }
    }
  }

  const setStatus = async (status) => {
    if (!selected) return
    setWorking(true)
    try {
      await updateRecord('contact_messages', selected.id, { estado: status })
      setSelected((current) => (current ? { ...current, estado: status } : current))
      notify(status === 'archivado' ? 'Mensaje archivado.' : 'Mensaje marcado como leído.')
    } catch (error) {
      console.error(error)
      notify(error.message || 'No se pudo actualizar el mensaje.', 'error')
    } finally {
      setWorking(false)
    }
  }

  const handleDelete = async () => {
    if (!pendingDelete) return
    setDeleting(true)
    try {
      await deleteRecord('contact_messages', pendingDelete.id)
      notify('Mensaje eliminado.')
      setPendingDelete(null)
      setSelected(null)
    } catch (error) {
      console.error(error)
      notify(error.message || 'No se pudo eliminar el mensaje.', 'error')
    } finally {
      setDeleting(false)
    }
  }

  return (
    <div className="space-y-7">
      <AdminPageHeader
        eyebrow="Gestión de formularios · Solo administrador"
        title="Mensajes recibidos"
        description="Bandeja de entrada de los formularios del sitio. Para búsqueda avanzada, edición completa y CRUD, usa Gestión de registros. Al abrir un mensaje nuevo se marca como leído."
        action={
          <span className="inline-flex items-center gap-2 rounded-full bg-[#e6c9a1]/20 px-4 py-2 text-[0.62rem] font-medium uppercase tracking-[0.14em] text-[#547972]">
            <Icon name="message" size={13} />
            {unread} sin leer
          </span>
        }
      />

      <div className="flex flex-wrap gap-2">
        {FILTERS.map((item) => (
          <button
            key={item.key}
            type="button"
            onClick={() => setFilter(item.key)}
            className={`rounded-full border px-4 py-2 text-[0.62rem] font-medium uppercase tracking-[0.14em] transition ${
              filter === item.key
                ? 'border-[#1f2a26] bg-[#1f2a26] text-[#f4efdf]'
                : 'border-[#25342e]/15 text-[#55645d] hover:border-[#25342e]/40'
            }`}
          >
            {item.label}
          </button>
        ))}
      </div>

      {filtered.length === 0 && !loading ? (
        <EmptyState
          icon="message"
          title="No hay mensajes en esta vista"
          description="Los mensajes del formulario de contacto llegarán aquí automáticamente."
        />
      ) : (
        <AdminCard className="overflow-hidden">
          <ul className="divide-y divide-[#25342e]/8">
            {filtered.map((message) => (
              <li key={message.id}>
                <button
                  type="button"
                  onClick={() => openMessage(message)}
                  className="flex w-full flex-col gap-2 px-4 py-4 text-left transition hover:bg-[#faf7ea] sm:flex-row sm:items-center sm:gap-5"
                >
                  <div className="flex min-w-0 flex-1 items-start gap-3">
                    <span
                      className={`mt-1.5 h-2 w-2 shrink-0 rounded-full ${
                        message.estado === 'nuevo' ? 'bg-[#e6c9a1]' : 'bg-transparent'
                      }`}
                    />
                    <div className="min-w-0">
                      <p className="flex flex-wrap items-center gap-2 text-sm font-medium text-[#25342e]">
                        {message.nombre}
                        <span className="font-normal text-[#7d8a82]">· {message.email}</span>
                      </p>
                      <p className="mt-0.5 truncate text-xs text-[#55645d]">
                        {message.asunto || 'Sin asunto'}
                      </p>
                      <p className="mt-1 line-clamp-1 text-xs text-[#7d8a82]">{message.mensaje}</p>
                    </div>
                  </div>
                  <div className="flex shrink-0 items-center gap-4 pl-5 sm:pl-0">
                    <span className="font-mono text-[0.55rem] whitespace-nowrap text-[#7d8a82]">
                      {formatDate(message.fecha)}
                    </span>
                    <span className="rounded-full bg-[#25342e]/5 px-2.5 py-1 text-[0.55rem] uppercase tracking-[0.1em] text-[#55645d]">
                      {STATE_LABEL[message.estado] || message.estado}
                    </span>
                  </div>
                </button>
              </li>
            ))}
          </ul>
        </AdminCard>
      )}

      <Modal
        open={Boolean(selected)}
        title={selected?.asunto || 'Mensaje'}
        description={selected ? `${selected.nombre} · ${selected.email}` : ''}
        onClose={() => setSelected(null)}
        footer={
          <>
            <button
              type="button"
              onClick={() => setPendingDelete(selected)}
              className="inline-flex items-center gap-2 rounded-full px-4 py-2.5 text-[0.62rem] font-medium uppercase tracking-[0.14em] text-[#9b4a32] transition hover:bg-[#9b4a32]/5"
            >
              <Icon name="trash" size={13} />
              Eliminar
            </button>
            <div className="flex-1" />
            <AdminButton
              variant="outline"
              onClick={() => setStatus('archivado')}
              disabled={working || selected?.estado === 'archivado'}
            >
              Archivar
            </AdminButton>
            <AdminButton
              onClick={() => setStatus('leido')}
              disabled={working || selected?.estado === 'leido'}
            >
              Marcar como leído
            </AdminButton>
          </>
        }
      >
        {selected && (
          <div className="space-y-5">
            <div className="grid gap-4 border-b border-[#25342e]/10 pb-5 text-xs sm:grid-cols-3">
              <div>
                <p className="font-mono text-[0.55rem] uppercase tracking-[0.16em] text-[#7d8a82]">
                  Fecha
                </p>
                <p className="mt-1 text-[#25342e]">{formatDate(selected.fecha)}</p>
              </div>
              <div>
                <p className="font-mono text-[0.55rem] uppercase tracking-[0.16em] text-[#7d8a82]">
                  Teléfono
                </p>
                <p className="mt-1 text-[#25342e]">{selected.telefono || 'No indicado'}</p>
              </div>
              <div>
                <p className="font-mono text-[0.55rem] uppercase tracking-[0.16em] text-[#7d8a82]">
                  Estado
                </p>
                <p className="mt-1 text-[#25342e]">{STATE_LABEL[selected.estado]}</p>
              </div>
            </div>

            <p className="text-sm leading-relaxed whitespace-pre-line text-[#3d453e]">
              {selected.mensaje}
            </p>

            <a
              href={`mailto:${selected.email}?subject=Respuesta%20a%20tu%20mensaje`}
              className="inline-flex items-center gap-2 border-b border-[#25342e]/25 pb-1 text-xs text-[#25342e] transition hover:border-[#25342e]"
            >
              <Icon name="mail" size={14} />
              Responder por correo
            </a>
          </div>
        )}
      </Modal>

      <ConfirmDialog
        open={Boolean(pendingDelete)}
        title="¿Eliminar este mensaje?"
        description="El mensaje se borrará permanentemente."
        loading={deleting}
        onConfirm={handleDelete}
        onCancel={() => setPendingDelete(null)}
      />
    </div>
  )
}
