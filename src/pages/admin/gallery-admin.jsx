import { useMemo, useState } from 'react'
import {
  AdminButton,
  AdminCard,
  AdminPageHeader,
  EmptyState,
  IconButton,
} from '../../components/admin/admin-page'
import Modal from '../../components/admin/modal'
import ConfirmDialog from '../../components/admin/confirm-dialog'
import ImageUploader from '../../components/admin/image-uploader'
import { Field, Select, TextArea, TextInput } from '../../components/admin/field'
import { Icon } from '../../components/common/icons'
import { useToast } from '../../context/toast-context'
import { useCollection } from '../../hooks/use-collection'
import { createRecord, deleteRecord, updateRecord } from '../../services/content'
import { formatShortDate, toDateInput, toTimestamp } from '../../utils/dates'

const EMPTY_FORM = {
  titulo: '',
  descripcion: '',
  ministerio: 'General',
  fecha: '',
  imagen: '',
}

export default function GalleryAdmin() {
  const { items, loading } = useCollection('gallery', { order: ['fecha', 'desc'], fallback: [] })
  const { items: ministries } = useCollection('ministries', {
    order: ['orden', 'asc'],
    fallback: [],
  })
  const { notify } = useToast()

  const [editing, setEditing] = useState(null)
  const [form, setForm] = useState(EMPTY_FORM)
  const [saving, setSaving] = useState(false)
  const [pendingDelete, setPendingDelete] = useState(null)
  const [deleting, setDeleting] = useState(false)
  const [filter, setFilter] = useState('Todos')

  const groups = useMemo(() => {
    const names = new Set(items.map((item) => item.ministerio || 'General'))
    return ['Todos', ...names]
  }, [items])

  const visible = filter === 'Todos'
    ? items
    : items.filter((item) => (item.ministerio || 'General') === filter)

  const openNew = () => {
    setForm({ ...EMPTY_FORM, fecha: toDateInput(new Date()) })
    setEditing({ id: null })
  }

  const openEdit = (item) => {
    setForm({
      titulo: item.titulo || '',
      descripcion: item.descripcion || '',
      ministerio: item.ministerio || 'General',
      fecha: toDateInput(item.fecha),
      imagen: item.imagen || '',
    })
    setEditing(item)
  }

  const handleSubmit = async (event) => {
    event.preventDefault()
    if (!form.imagen) {
      notify('Sube o pega la URL de una imagen.', 'error')
      return
    }
    setSaving(true)
    try {
      const payload = {
        ...form,
        titulo: form.titulo.trim(),
        descripcion: form.descripcion.trim(),
        fecha: form.fecha ? toTimestamp(`${form.fecha}T12:00:00`) : toTimestamp(new Date()),
      }
      if (editing?.id) {
        await updateRecord('gallery', editing.id, payload)
        notify('Fotografía actualizada.')
      } else {
        await createRecord('gallery', payload)
        notify('Fotografía publicada en la galería.')
      }
      setEditing(null)
    } catch (error) {
      console.error(error)
      notify(error.message || 'No se pudo guardar la fotografía.', 'error')
    } finally {
      setSaving(false)
    }
  }

  const handleDelete = async () => {
    if (!pendingDelete) return
    setDeleting(true)
    try {
      await deleteRecord('gallery', pendingDelete.id)
      notify('Fotografía eliminada.')
      setPendingDelete(null)
    } catch (error) {
      console.error(error)
      notify(error.message || 'No se pudo eliminar.', 'error')
    } finally {
      setDeleting(false)
    }
  }

  return (
    <div className="space-y-7">
      <AdminPageHeader
        eyebrow="Archivo visual"
        title="Galería"
        description="Fotografías de eventos, ministerios e historia. Asigna cada imagen a un ministerio para que aparezca en su página."
        action={
          <AdminButton icon="plus" onClick={openNew}>
            Subir fotografía
          </AdminButton>
        }
      />

      <div className="flex flex-wrap gap-2">
        {groups.map((group) => (
          <button
            key={group}
            type="button"
            onClick={() => setFilter(group)}
            className={`rounded-full border px-4 py-2 text-[0.62rem] font-medium uppercase tracking-[0.14em] transition ${
              filter === group
                ? 'border-[#1f2a26] bg-[#1f2a26] text-[#f4efdf]'
                : 'border-[#25342e]/15 text-[#55645d] hover:border-[#25342e]/40'
            }`}
          >
            {group}
          </button>
        ))}
      </div>

      {visible.length === 0 && !loading ? (
        <EmptyState
          icon="gallery"
          title="Todavía no hay fotografías"
          description="Sube la primera imagen para que aparezca en las galerías del sitio."
          action={
            <AdminButton icon="upload" onClick={openNew}>
              Subir imagen
            </AdminButton>
          }
        />
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {visible.map((item) => (
            <AdminCard key={item.id} className="group overflow-hidden">
              <div className="relative aspect-[4/3] overflow-hidden bg-[#25342e]/5">
                <img
                  src={item.imagen}
                  alt={item.titulo || ''}
                  loading="lazy"
                  className="h-full w-full object-cover transition duration-500 group-hover:scale-[1.03]"
                />
                <div className="absolute top-2 right-2 flex gap-1.5 opacity-0 transition group-hover:opacity-100">
                  <button
                    type="button"
                    onClick={() => openEdit(item)}
                    aria-label="Editar"
                    className="grid h-8 w-8 place-items-center rounded-full bg-white/90 text-[#25342e] shadow"
                  >
                    <Icon name="pencil" size={14} />
                  </button>
                  <button
                    type="button"
                    onClick={() => setPendingDelete(item)}
                    aria-label="Eliminar"
                    className="grid h-8 w-8 place-items-center rounded-full bg-[#9b4a32] text-white shadow"
                  >
                    <Icon name="trash" size={14} />
                  </button>
                </div>
              </div>
              <div className="p-4">
                <p className="truncate text-sm font-medium text-[#25342e]">
                  {item.titulo || 'Sin título'}
                </p>
                <p className="mt-1 truncate text-xs text-[#7d8a82]">
                  {item.ministerio || 'General'} · {formatShortDate(item.fecha)}
                </p>
              </div>
            </AdminCard>
          ))}
        </div>
      )}

      <Modal
        open={Boolean(editing)}
        title={editing?.id ? 'Editar fotografía' : 'Subir fotografía'}
        onClose={() => setEditing(null)}
        footer={
          <>
            <AdminButton variant="outline" onClick={() => setEditing(null)} disabled={saving}>
              Cancelar
            </AdminButton>
            <button
              type="submit"
              form="gallery-form"
              disabled={saving}
              className="inline-flex items-center gap-2 rounded-full bg-[#1f2a26] px-5 py-2.5 text-[0.65rem] font-medium uppercase tracking-[0.16em] text-[#f4efdf] disabled:opacity-50"
            >
              {saving ? 'Guardando…' : 'Guardar fotografía'}
            </button>
          </>
        }
      >
        <form id="gallery-form" onSubmit={handleSubmit} className="grid gap-5 sm:grid-cols-2">
          <Field label="Título" htmlFor="gallery-titulo" className="sm:col-span-2">
            <TextInput
              id="gallery-titulo"
              value={form.titulo}
              onChange={(event) => setForm((current) => ({ ...current, titulo: event.target.value }))}
              placeholder="Culto de celebración"
            />
          </Field>

          <Field label="Ministerio" htmlFor="gallery-ministerio" hint="Determina en qué galería aparece.">
            <Select
              id="gallery-ministerio"
              value={form.ministerio}
              onChange={(event) =>
                setForm((current) => ({ ...current, ministerio: event.target.value }))
              }
            >
              <option value="General">General</option>
              <option value="Historia">Historia</option>
              {ministries.map((ministry) => (
                <option key={ministry.id} value={ministry.nombre}>
                  {ministry.nombre}
                </option>
              ))}
            </Select>
          </Field>

          <Field label="Fecha" htmlFor="gallery-fecha">
            <TextInput
              id="gallery-fecha"
              type="date"
              value={form.fecha}
              onChange={(event) => setForm((current) => ({ ...current, fecha: event.target.value }))}
            />
          </Field>

          <Field label="Descripción" htmlFor="gallery-descripcion" className="sm:col-span-2">
            <TextArea
              id="gallery-descripcion"
              rows={3}
              value={form.descripcion}
              onChange={(event) =>
                setForm((current) => ({ ...current, descripcion: event.target.value }))
              }
            />
          </Field>

          <div className="sm:col-span-2">
            <ImageUploader
              value={form.imagen}
              onChange={(url) => setForm((current) => ({ ...current, imagen: url }))}
              folder="gallery"
              label="Imagen *"
            />
          </div>
        </form>
      </Modal>

      <ConfirmDialog
        open={Boolean(pendingDelete)}
        title="¿Eliminar esta fotografía?"
        description={`Se eliminará “${pendingDelete?.titulo || 'esta imagen'}” de la galería.`}
        loading={deleting}
        onConfirm={handleDelete}
        onCancel={() => setPendingDelete(null)}
      />
    </div>
  )
}
