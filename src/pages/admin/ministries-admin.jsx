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
import { slugify } from '../../utils/misc'

const EMPTY_FORM = {
  nombre: '',
  slug: '',
  lema: '',
  descripcion: '',
  objetivo: '',
  actividades: [],
  responsable: '',
  imagenPrincipal: '',
  logo: '',
  galeria: [],
  estado: 'publicado',
  orden: 1,
  acento: '#e6c9a1',
  pendiente: false,
}

export default function MinistriesAdmin() {
  const { items, loading } = useCollection('ministries', {
    order: ['orden', 'asc'],
    fallback: [],
  })
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

  const openEdit = (ministry) => {
    setForm({
      nombre: ministry.nombre || '',
      slug: ministry.slug || '',
      lema: ministry.lema || '',
      descripcion: ministry.descripcion || '',
      objetivo: ministry.objetivo || '',
      actividades: ministry.actividades || [],
      responsable: ministry.responsable || '',
      imagenPrincipal: ministry.imagenPrincipal || '',
      logo: ministry.logo || '',
      galeria: ministry.galeria || [],
      estado: ministry.estado || 'publicado',
      orden: ministry.orden ?? 1,
      acento: ministry.acento || '#e6c9a1',
      pendiente: Boolean(ministry.pendiente),
    })
    setErrors({})
    setEditing(ministry)
  }

  const addToGallery = (url) => {
    if (!url) return
    setForm((current) => ({ ...current, galeria: [...current.galeria, url] }))
    notify('Fotografía añadida a la galería.')
  }

  const removeFromGallery = (index) => {
    setForm((current) => ({
      ...current,
      galeria: current.galeria.filter((_, position) => position !== index),
    }))
  }

  const handleSubmit = async (submitEvent) => {
    submitEvent.preventDefault()

    const nextErrors = {}
    if (form.nombre.trim().length < 2) nextErrors.nombre = 'Escribe el nombre del ministerio.'
    if (!Number.isFinite(Number(form.orden))) nextErrors.orden = 'Usa un número.'
    setErrors(nextErrors)
    if (Object.keys(nextErrors).length > 0) return

    setSaving(true)
    try {
      const payload = {
        ...form,
        nombre: form.nombre.trim(),
        slug: form.slug.trim() || slugify(form.nombre),
        lema: form.lema.trim(),
        descripcion: form.descripcion.trim(),
        objetivo: form.objetivo.trim(),
        actividades: form.actividades.filter((activity) => activity.trim()),
        orden: Number(form.orden),
      }

      if (editing?.id) {
        await updateRecord('ministries', editing.id, payload)
        notify('Ministerio actualizado en el sitio.')
      } else {
        await createRecord('ministries', payload)
        notify('Ministerio creado.')
      }
      setEditing(null)
    } catch (error) {
      console.error(error)
      notify(error.message || 'No se pudo guardar el ministerio.', 'error')
    } finally {
      setSaving(false)
    }
  }

  const handleDelete = async () => {
    if (!pendingDelete) return
    setDeleting(true)
    try {
      await deleteRecord('ministries', pendingDelete.id)
      notify('Ministerio eliminado.')
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
        eyebrow="Áreas de servicio"
        title="Ministerios"
        description="Cada ministerio tiene su propia página. Edita su identidad, objetivo, actividades y galería."
        action={
          <AdminButton icon="plus" onClick={openNew}>
            Nuevo ministerio
          </AdminButton>
        }
      />

      {items.length === 0 && !loading ? (
        <EmptyState
          icon="users"
          title="Aún no hay ministerios"
          description="Crea el primer ministerio para que aparezca en el sitio público."
          action={
            <AdminButton icon="plus" onClick={openNew}>
              Crear ministerio
            </AdminButton>
          }
        />
      ) : (
        <div className="grid gap-4 md:grid-cols-2">
          {items.map((ministry) => (
            <AdminCard key={ministry.id} className="flex flex-col p-5">
              <div className="flex items-start justify-between gap-4">
                <div className="flex items-center gap-3">
                  <span
                    className="grid h-12 w-12 shrink-0 place-items-center overflow-hidden rounded-full"
                    style={{ backgroundColor: `${ministry.acento || '#e6c9a1'}1f` }}
                  >
                    {ministry.logo ? (
                      <img src={ministry.logo} alt="" className="h-full w-full object-cover" />
                    ) : (
                      <Icon name="users" size={18} className="text-[#547972]" />
                    )}
                  </span>
                  <div>
                    <p className="font-display text-xl leading-tight text-[#1f2a26]">
                      {ministry.nombre}
                    </p>
                    <p className="font-mono text-[0.55rem] text-[#7d8a82]">
                      /{ministry.slug || ministry.id}
                    </p>
                  </div>
                </div>
                <StatusBadge status={ministry.estado} />
              </div>

              <p className="mt-4 line-clamp-2 text-xs leading-relaxed text-[#55645d]">
                {ministry.descripcion || 'Sin descripción todavía.'}
              </p>

              <div className="mt-4 flex items-center gap-4 text-[0.65rem] text-[#7d8a82]">
                <span>Orden {ministry.orden}</span>
                <span>·</span>
                <span>{(ministry.galeria || []).length} fotos en galería</span>
              </div>

              <div className="mt-4 flex justify-end gap-2 border-t border-[#25342e]/8 pt-4">
                <IconButton icon="pencil" label="Editar" onClick={() => openEdit(ministry)} />
                <IconButton
                  icon="trash"
                  label="Eliminar"
                  tone="danger"
                  onClick={() => setPendingDelete(ministry)}
                />
              </div>
            </AdminCard>
          ))}
        </div>
      )}

      <Modal
        open={Boolean(editing)}
        title={editing?.id ? 'Editar ministerio' : 'Nuevo ministerio'}
        description="Nombre, identidad y contenido de la página del ministerio."
        onClose={() => setEditing(null)}
        size="lg"
        footer={
          <>
            <AdminButton variant="outline" onClick={() => setEditing(null)} disabled={saving}>
              Cancelar
            </AdminButton>
            <button
              type="submit"
              form="ministry-form"
              disabled={saving}
              className="inline-flex items-center gap-2 rounded-full bg-[#1f2a26] px-5 py-2.5 text-[0.65rem] font-medium uppercase tracking-[0.16em] text-[#f4efdf] disabled:opacity-50"
            >
              {saving ? 'Guardando…' : 'Guardar ministerio'}
            </button>
          </>
        }
      >
        <form id="ministry-form" onSubmit={handleSubmit} className="grid gap-5 sm:grid-cols-2">
          <Field label="Nombre" htmlFor="ministry-nombre" required error={errors.nombre}>
            <TextInput
              id="ministry-nombre"
              value={form.nombre}
              onChange={update('nombre')}
              placeholder="Músicos"
            />
          </Field>

          <Field label="Slug (URL)" htmlFor="ministry-slug" hint="Se genera automáticamente si se deja vacío.">
            <TextInput
              id="ministry-slug"
              value={form.slug}
              onChange={update('slug')}
              placeholder="musicos"
            />
          </Field>

          <Field label="Lema" htmlFor="ministry-lema">
            <TextInput
              id="ministry-lema"
              value={form.lema}
              onChange={update('lema')}
              placeholder="Adoración que prepara el corazón"
            />
          </Field>

          <Field label="Responsable" htmlFor="ministry-responsable">
            <TextInput
              id="ministry-responsable"
              value={form.responsable}
              onChange={update('responsable')}
              placeholder="Opcional"
            />
          </Field>

          <Field label="Descripción" htmlFor="ministry-descripcion" className="sm:col-span-2">
            <TextArea
              id="ministry-descripcion"
              rows={4}
              value={form.descripcion}
              onChange={update('descripcion')}
            />
          </Field>

          <Field label="Objetivo" htmlFor="ministry-objetivo" className="sm:col-span-2">
            <TextArea
              id="ministry-objetivo"
              rows={3}
              value={form.objetivo}
              onChange={update('objetivo')}
            />
          </Field>

          <Field
            label="Actividades"
            htmlFor="ministry-actividades"
            hint="Una actividad por línea."
            className="sm:col-span-2"
          >
            <TextArea
              id="ministry-actividades"
              rows={4}
              value={form.actividades.join('\n')}
              onChange={(event) =>
                setForm((current) => ({
                  ...current,
                  actividades: event.target.value.split('\n'),
                }))
              }
              placeholder={'Ensayos semanales\nServicio en cultos dominicales'}
            />
          </Field>

          <Field label="Orden" htmlFor="ministry-orden" required error={errors.orden}>
            <TextInput
              id="ministry-orden"
              type="number"
              min="1"
              value={form.orden}
              onChange={update('orden')}
            />
          </Field>

          <Field label="Color de identidad" htmlFor="ministry-acento">
            <div className="flex items-center gap-3">
              <input
                id="ministry-acento"
                type="color"
                value={form.acento}
                onChange={update('acento')}
                className="h-9 w-14 cursor-pointer rounded border border-[#25342e]/15 bg-white p-1"
              />
              <TextInput value={form.acento} onChange={update('acento')} />
            </div>
          </Field>

          <Field label="Estado" htmlFor="ministry-estado">
            <Select id="ministry-estado" value={form.estado} onChange={update('estado')}>
              <option value="publicado">Publicado</option>
              <option value="borrador">Borrador</option>
            </Select>
          </Field>

          <div className="flex items-end pb-2">
            <label className="flex cursor-pointer items-center gap-2.5 text-sm text-[#44544d]">
              <input
                type="checkbox"
                checked={form.pendiente}
                onChange={update('pendiente')}
                className="h-4 w-4 accent-[#547972]"
              />
              Marcar identidad como &quot;en proceso&quot;
            </label>
          </div>

          <div className="sm:col-span-2">
            <ImageUploader
              value={form.logo}
              onChange={(url) => setForm((current) => ({ ...current, logo: url }))}
              folder="ministries"
              label="Logotipo del ministerio"
              hint="Se muestra en las tarjetas y en la página del ministerio."
            />
          </div>

          <div className="sm:col-span-2">
            <ImageUploader
              value={form.imagenPrincipal}
              onChange={(url) => setForm((current) => ({ ...current, imagenPrincipal: url }))}
              folder="ministries"
              label="Imagen principal"
              hint="Fotografía de portada del ministerio."
            />
          </div>

          <div className="sm:col-span-2 border-t border-[#25342e]/10 pt-5">
            <p className="admin-label">Galería</p>
            {form.galeria.length > 0 && (
              <div className="mb-4 grid grid-cols-3 gap-2 sm:grid-cols-4">
                {form.galeria.map((url, index) => (
                  <div key={`${url}-${index}`} className="group relative aspect-[4/3] overflow-hidden">
                    <img src={url} alt="" className="h-full w-full object-cover" />
                    <button
                      type="button"
                      onClick={() => removeFromGallery(index)}
                      aria-label="Quitar fotografía"
                      className="absolute top-1 right-1 grid h-7 w-7 place-items-center rounded-full bg-[#1f2a26]/80 text-white opacity-0 transition group-hover:opacity-100"
                    >
                      <Icon name="close" size={13} />
                    </button>
                  </div>
                ))}
              </div>
            )}
            <ImageUploader
              value=""
              onChange={addToGallery}
              folder="ministries"
              label=""
              hint="Cada imagen subida se añade a la galería del ministerio."
            />
          </div>
        </form>
      </Modal>

      <ConfirmDialog
        open={Boolean(pendingDelete)}
        title="¿Eliminar este ministerio?"
        description={`Se eliminará “${pendingDelete?.nombre || 'este ministerio'}” y su página dejará de existir.`}
        loading={deleting}
        onConfirm={handleDelete}
        onCancel={() => setPendingDelete(null)}
      />
    </div>
  )
}
