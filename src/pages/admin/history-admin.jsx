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

const EMPTY_FORM = {
  titulo: '',
  fecha: '',
  categoria: '',
  descripcion: '',
  imagen: '',
  orden: 1,
  estado: 'publicado',
  pendiente: false,
}

export default function HistoryAdmin() {
  const { items, loading } = useCollection('history', { order: ['orden', 'asc'], fallback: [] })
  const { notify } = useToast()

  const [editing, setEditing] = useState(null)
  const [form, setForm] = useState(EMPTY_FORM)
  const [errors, setErrors] = useState({})
  const [saving, setSaving] = useState(false)
  const [pendingDelete, setPendingDelete] = useState(null)
  const [deleting, setDeleting] = useState(false)

  const update = (field) => (event) => {
    const value = event.target.type === 'checkbox' ? event.target.checked : event.target.value
    setForm((current) => ({ ...current, [field]: value }))
    setErrors((current) => ({ ...current, [field]: undefined }))
  }

  const openNew = () => {
    setForm({ ...EMPTY_FORM, orden: items.length + 1 })
    setErrors({})
    setEditing({ id: null })
  }

  const openEdit = (entry) => {
    setForm({
      titulo: entry.titulo || '',
      fecha: entry.fecha || '',
      categoria: entry.categoria || '',
      descripcion: entry.descripcion || '',
      imagen: entry.imagen || '',
      orden: entry.orden ?? 1,
      estado: entry.estado || 'publicado',
      pendiente: Boolean(entry.pendiente),
    })
    setErrors({})
    setEditing(entry)
  }

  const handleSubmit = async (submitEvent) => {
    submitEvent.preventDefault()
    const nextErrors = {}
    if (form.titulo.trim().length < 2) nextErrors.titulo = 'Escribe un título.'
    if (!Number.isFinite(Number(form.orden))) nextErrors.orden = 'Usa un número.'
    setErrors(nextErrors)
    if (Object.keys(nextErrors).length > 0) return

    setSaving(true)
    try {
      const payload = {
        ...form,
        titulo: form.titulo.trim(),
        descripcion: form.descripcion.trim(),
        fecha: form.fecha.trim() || 'Por documentar',
        orden: Number(form.orden),
      }

      if (editing?.id) {
        await updateRecord('history', editing.id, payload)
        notify('Entrada de historia actualizada.')
      } else {
        await createRecord('history', payload)
        notify('Entrada de historia creada.')
      }
      setEditing(null)
    } catch (error) {
      console.error(error)
      notify(error.message || 'No se pudo guardar la entrada.', 'error')
    } finally {
      setSaving(false)
    }
  }

  const handleDelete = async () => {
    if (!pendingDelete) return
    setDeleting(true)
    try {
      await deleteRecord('history', pendingDelete.id)
      notify('Entrada eliminada.')
      setPendingDelete(null)
    } catch (error) {
      console.error(error)
      notify(error.message || 'No se pudo eliminar la entrada.', 'error')
    } finally {
      setDeleting(false)
    }
  }

  return (
    <div className="space-y-7">
      <AdminPageHeader
        eyebrow="Nuestra historia"
        title="Historia de la iglesia"
        description="Documenta la historia con datos verificables. Puedes usar un año (“1985”), un periodo (“1990–1995”) o “Por documentar”."
        action={
          <AdminButton icon="plus" onClick={openNew}>
            Nueva entrada
          </AdminButton>
        }
      />

      <div className="border border-[#e6c9a1]/30 bg-[#e6c9a1]/10 p-4 text-xs leading-relaxed text-[#6d5c3b]">
        <strong>Importante:</strong> no publiques fechas, nombres ni testimonios sin verificarlos.
        La sección pública muestra una nota de archivo mientras se completa la documentación.
      </div>

      {items.length === 0 && !loading ? (
        <EmptyState
          icon="history"
          title="La línea de tiempo está vacía"
          description="Crea la primera entrada para comenzar a documentar la historia de la iglesia."
          action={
            <AdminButton icon="plus" onClick={openNew}>
              Crear entrada
            </AdminButton>
          }
        />
      ) : (
        <AdminCard className="overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full min-w-[640px] text-left text-sm">
              <thead className="border-b border-[#25342e]/10 bg-[#faf7ea] text-[0.58rem] uppercase tracking-[0.16em] text-[#5f6d66]">
                <tr>
                  <th className="px-4 py-3 font-medium">Orden</th>
                  <th className="px-4 py-3 font-medium">Entrada</th>
                  <th className="px-4 py-3 font-medium">Fecha</th>
                  <th className="px-4 py-3 font-medium">Estado</th>
                  <th className="px-4 py-3 text-right font-medium">Acciones</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#25342e]/8">
                {items.map((entry) => (
                  <tr key={entry.id} className="transition hover:bg-[#faf7ea]/60">
                    <td className="px-4 py-3 font-mono text-[0.68rem] text-[#7d8a82]">
                      {String(entry.orden ?? 0).padStart(2, '0')}
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-3">
                        {entry.imagen ? (
                          <img src={entry.imagen} alt="" className="h-10 w-14 shrink-0 object-cover" />
                        ) : (
                          <span className="grid h-10 w-14 shrink-0 place-items-center bg-[#25342e]/5 text-[#7d8a82]">
                            <Icon name="image" size={15} />
                          </span>
                        )}
                        <div className="min-w-0">
                          <p className="truncate font-medium text-[#25342e]">{entry.titulo}</p>
                          <p className="truncate text-xs text-[#7d8a82]">{entry.categoria}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-4 py-3 text-xs text-[#55645d]">{entry.fecha}</td>
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-2">
                        <StatusBadge status={entry.estado} />
                        {entry.pendiente && (
                          <span className="rounded-full bg-[#25342e]/5 px-2 py-0.5 text-[0.5rem] uppercase tracking-[0.12em] text-[#7d8a82]">
                            En proceso
                          </span>
                        )}
                      </div>
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex justify-end gap-2">
                        <IconButton icon="pencil" label="Editar" onClick={() => openEdit(entry)} />
                        <IconButton
                          icon="trash"
                          label="Eliminar"
                          tone="danger"
                          onClick={() => setPendingDelete(entry)}
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
        title={editing?.id ? 'Editar entrada' : 'Nueva entrada'}
        onClose={() => setEditing(null)}
        size="lg"
        footer={
          <>
            <AdminButton variant="outline" onClick={() => setEditing(null)} disabled={saving}>
              Cancelar
            </AdminButton>
            <button
              type="submit"
              form="history-form"
              disabled={saving}
              className="inline-flex items-center gap-2 rounded-full bg-[#1f2a26] px-5 py-2.5 text-[0.65rem] font-medium uppercase tracking-[0.16em] text-[#f4efdf] disabled:opacity-50"
            >
              {saving ? 'Guardando…' : 'Guardar entrada'}
            </button>
          </>
        }
      >
        <form id="history-form" onSubmit={handleSubmit} className="grid gap-5 sm:grid-cols-2">
          <Field label="Título" htmlFor="history-titulo" required error={errors.titulo} className="sm:col-span-2">
            <TextInput
              id="history-titulo"
              value={form.titulo}
              onChange={update('titulo')}
              placeholder="Los inicios"
            />
          </Field>

          <Field label="Fecha o periodo" htmlFor="history-fecha" hint="Ej. 1985, 1990–1995, Por documentar">
            <TextInput id="history-fecha" value={form.fecha} onChange={update('fecha')} />
          </Field>

          <Field label="Categoría" htmlFor="history-categoria" hint="Origen, Desarrollo, Actualidad…">
            <TextInput id="history-categoria" value={form.categoria} onChange={update('categoria')} />
          </Field>

          <Field label="Orden" htmlFor="history-orden" required error={errors.orden}>
            <TextInput
              id="history-orden"
              type="number"
              min="1"
              value={form.orden}
              onChange={update('orden')}
            />
          </Field>

          <Field label="Estado" htmlFor="history-estado">
            <Select id="history-estado" value={form.estado} onChange={update('estado')}>
              <option value="publicado">Publicado</option>
              <option value="borrador">Borrador</option>
            </Select>
          </Field>

          <Field label="Descripción" htmlFor="history-descripcion" className="sm:col-span-2">
            <TextArea
              id="history-descripcion"
              rows={5}
              value={form.descripcion}
              onChange={update('descripcion')}
              placeholder="Relato verificado, con contexto y fechas confirmadas."
            />
          </Field>

          <div className="sm:col-span-2">
            <label className="flex cursor-pointer items-center gap-2.5 text-sm text-[#44544d]">
              <input
                type="checkbox"
                checked={form.pendiente}
                onChange={update('pendiente')}
                className="h-4 w-4 accent-[#547972]"
              />
              Mostrar como “En verificación” en el sitio
            </label>
          </div>

          <div className="sm:col-span-2">
            <ImageUploader
              value={form.imagen}
              onChange={(url) => setForm((current) => ({ ...current, imagen: url }))}
              folder="history"
              label="Fotografía histórica"
            />
          </div>
        </form>
      </Modal>

      <ConfirmDialog
        open={Boolean(pendingDelete)}
        title="¿Eliminar esta entrada?"
        description={`Se eliminará “${pendingDelete?.titulo || 'esta entrada'}” de la línea de tiempo.`}
        loading={deleting}
        onConfirm={handleDelete}
        onCancel={() => setPendingDelete(null)}
      />
    </div>
  )
}
