import { useState } from 'react'
import {
  AdminButton,
  AdminCard,
  AdminPageHeader,
  EmptyState,
  IconButton,
  StatusBadge,
} from '../../components/admin/admin-page'
import Modal from '../../components/admin/modal'
import ConfirmDialog from '../../components/admin/confirm-dialog'
import ImageUploader from '../../components/admin/image-uploader'
import { Field, Select, TextArea, TextInput } from '../../components/admin/field'
import { Icon } from '../../components/common/icons'
import { useToast } from '../../context/toast-context'
import { useCollection } from '../../hooks/use-collection'
import { createRecord, deleteRecord, updateRecord } from '../../services/content'
import { EVENT_CATEGORIES } from '../../data/content'
import { formatShortDate, toDateInput, toTimestamp } from '../../utils/dates'

const EMPTY_FORM = {
  titulo: '',
  descripcion: '',
  fecha: '',
  hora: '',
  ubicacion: '',
  categoria: EVENT_CATEGORIES[0],
  estado: 'publicado',
  imagen: '',
}

export default function EventsAdmin() {
  const { items, loading } = useCollection('events', { order: ['fecha', 'desc'], fallback: [] })
  const { notify } = useToast()

  const [editing, setEditing] = useState(null)
  const [form, setForm] = useState(EMPTY_FORM)
  const [errors, setErrors] = useState({})
  const [saving, setSaving] = useState(false)
  const [pendingDelete, setPendingDelete] = useState(null)
  const [deleting, setDeleting] = useState(false)

  const update = (field) => (event) => {
    setForm((current) => ({ ...current, [field]: event.target.value }))
    setErrors((current) => ({ ...current, [field]: undefined }))
  }

  const openNew = () => {
    setForm({ ...EMPTY_FORM, fecha: toDateInput(new Date()) })
    setErrors({})
    setEditing({ id: null })
  }

  const openEdit = (event) => {
    setForm({
      titulo: event.titulo || '',
      descripcion: event.descripcion || '',
      fecha: toDateInput(event.fecha),
      hora: event.hora || '',
      ubicacion: event.ubicacion || '',
      categoria: event.categoria || EVENT_CATEGORIES[0],
      estado: event.estado || 'publicado',
      imagen: event.imagen || '',
    })
    setErrors({})
    setEditing(event)
  }

  const handleSubmit = async (submitEvent) => {
    submitEvent.preventDefault()

    const nextErrors = {}
    if (form.titulo.trim().length < 3) nextErrors.titulo = 'Escribe un título.'
    if (!form.fecha) nextErrors.fecha = 'Selecciona una fecha.'
    setErrors(nextErrors)
    if (Object.keys(nextErrors).length > 0) return

    setSaving(true)
    try {
      const payload = {
        ...form,
        titulo: form.titulo.trim(),
        descripcion: form.descripcion.trim(),
        imagenPosicion: 'center 42%',
        fecha: toTimestamp(`${form.fecha}T12:00:00`),
      }

      if (editing?.id) {
        await updateRecord('events', editing.id, payload)
        notify('Evento actualizado.')
      } else {
        await createRecord('events', payload)
        notify('Evento creado. Ya se refleja en el sitio.')
      }
      setEditing(null)
    } catch (error) {
      console.error(error)
      notify(error.message || 'No se pudo guardar el evento.', 'error')
    } finally {
      setSaving(false)
    }
  }

  const handleDelete = async () => {
    if (!pendingDelete) return
    setDeleting(true)
    try {
      await deleteRecord('events', pendingDelete.id)
      notify('Evento eliminado.')
      setPendingDelete(null)
    } catch (error) {
      console.error(error)
      notify(error.message || 'No se pudo eliminar el evento.', 'error')
    } finally {
      setDeleting(false)
    }
  }

  return (
    <div className="space-y-7">
      <AdminPageHeader
        eyebrow="Calendario"
        title="Eventos"
        description="Actividades especiales, conferencias y campañas. Los cultos y reuniones semanales se editan en Configuración → Horarios, no aquí. Lo que publiques aparece de inmediato en la agenda del sitio."
        action={
          <AdminButton icon="plus" onClick={openNew}>
            Nuevo evento
          </AdminButton>
        }
      />

      {items.length === 0 && !loading ? (
        <EmptyState
          icon="calendar"
          title="Aún no hay eventos"
          description="Crea el primer evento y aparecerá automáticamente en la página de Eventos y en la portada."
          action={
            <AdminButton icon="plus" onClick={openNew}>
              Crear evento
            </AdminButton>
          }
        />
      ) : (
        <AdminCard className="overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full min-w-[720px] text-left text-sm">
              <thead className="border-b border-[#25342e]/10 bg-[#faf7ea] text-[0.58rem] uppercase tracking-[0.16em] text-[#5f6d66]">
                <tr>
                  <th className="px-4 py-3 font-medium">Fecha</th>
                  <th className="px-4 py-3 font-medium">Evento</th>
                  <th className="px-4 py-3 font-medium">Categoría</th>
                  <th className="px-4 py-3 font-medium">Estado</th>
                  <th className="px-4 py-3 text-right font-medium">Acciones</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#25342e]/8">
                {items.map((event) => (
                  <tr key={event.id} className="transition hover:bg-[#faf7ea]/60">
                    <td className="px-4 py-3 whitespace-nowrap font-mono text-[0.68rem] text-[#55645d]">
                      {formatShortDate(event.fecha)}
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-3">
                        {event.imagen ? (
                          <img
                            src={event.imagen}
                            alt=""
                            className="h-10 w-14 shrink-0 object-cover"
                          />
                        ) : (
                          <span className="grid h-10 w-14 shrink-0 place-items-center bg-[#25342e]/5 text-[#7d8a82]">
                            <Icon name="image" size={16} />
                          </span>
                        )}
                        <div className="min-w-0">
                          <p className="truncate font-medium text-[#25342e]">{event.titulo}</p>
                          <p className="truncate text-xs text-[#7d8a82]">
                            {event.hora} · {event.ubicacion || 'Sin ubicación'}
                          </p>
                        </div>
                      </div>
                    </td>
                    <td className="px-4 py-3 text-xs text-[#55645d]">{event.categoria}</td>
                    <td className="px-4 py-3">
                      <StatusBadge status={event.estado} />
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex justify-end gap-2">
                        <IconButton icon="pencil" label="Editar" onClick={() => openEdit(event)} />
                        <IconButton
                          icon="trash"
                          label="Eliminar"
                          tone="danger"
                          onClick={() => setPendingDelete(event)}
                        />
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </AdminCard>
      )}

      <Modal
        open={Boolean(editing)}
        title={editing?.id ? 'Editar evento' : 'Nuevo evento'}
        description="Los campos con * son obligatorios."
        onClose={() => setEditing(null)}
        size="lg"
        footer={
          <>
            <AdminButton variant="outline" onClick={() => setEditing(null)} disabled={saving}>
              Cancelar
            </AdminButton>
            <button
              type="submit"
              form="event-form"
              disabled={saving}
              className="inline-flex items-center gap-2 rounded-full bg-[#1f2a26] px-5 py-2.5 text-[0.65rem] font-medium uppercase tracking-[0.16em] text-[#f4efdf] disabled:opacity-50"
            >
              {saving ? 'Guardando…' : 'Guardar evento'}
            </button>
          </>
        }
      >
        <form id="event-form" onSubmit={handleSubmit} className="grid gap-5 sm:grid-cols-2">
          <Field label="Título" htmlFor="event-titulo" required error={errors.titulo} className="sm:col-span-2">
            <TextInput
              id="event-titulo"
              value={form.titulo}
              onChange={update('titulo')}
              placeholder="Conferencia misionera"
            />
          </Field>

          <Field label="Fecha" htmlFor="event-fecha" required error={errors.fecha}>
            <TextInput id="event-fecha" type="date" value={form.fecha} onChange={update('fecha')} />
          </Field>

          <Field label="Hora" htmlFor="event-hora" hint="Ej. 7:00 PM">
            <TextInput id="event-hora" value={form.hora} onChange={update('hora')} placeholder="7:00 PM" />
          </Field>

          <Field label="Ubicación" htmlFor="event-ubicacion">
            <TextInput
              id="event-ubicacion"
              value={form.ubicacion}
              onChange={update('ubicacion')}
              placeholder="Asambleas de Dios Getsemaní"
            />
          </Field>

          <Field label="Categoría" htmlFor="event-categoria">
            <Select id="event-categoria" value={form.categoria} onChange={update('categoria')}>
              {EVENT_CATEGORIES.map((category) => (
                <option key={category} value={category}>
                  {category}
                </option>
              ))}
            </Select>
          </Field>

          <Field label="Estado" htmlFor="event-estado" hint="Solo los publicados se ven en el sitio.">
            <Select id="event-estado" value={form.estado} onChange={update('estado')}>
              <option value="publicado">Publicado</option>
              <option value="borrador">Borrador</option>
            </Select>
          </Field>

          <Field label="Descripción" htmlFor="event-descripcion" className="sm:col-span-2">
            <TextArea
              id="event-descripcion"
              rows={4}
              value={form.descripcion}
              onChange={update('descripcion')}
              placeholder="Describe la actividad, a quién está dirigida y qué pueden esperar."
            />
          </Field>

          <div className="sm:col-span-2">
            <ImageUploader
              value={form.imagen}
              onChange={(url) => setForm((current) => ({ ...current, imagen: url }))}
              folder="events"
              label="Fotografía del evento"
            />
          </div>
        </form>
      </Modal>

      <ConfirmDialog
        open={Boolean(pendingDelete)}
        title="¿Eliminar este evento?"
        description={`Se eliminará “${pendingDelete?.titulo || 'este evento'}” del calendario.`}
        loading={deleting}
        onConfirm={handleDelete}
        onCancel={() => setPendingDelete(null)}
      />
    </div>
  )
}
