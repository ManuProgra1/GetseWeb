import { useMemo, useState } from 'react'
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
import { useAuth } from '../../context/auth-context'
import { useToast } from '../../context/toast-context'
import { useCollection } from '../../hooks/use-collection'
import { createRecord, deleteRecord, updateRecord } from '../../services/content'

const PLACEMENTS = [
  { value: 'inicio', label: 'Inicio · álbum de la semana' },
  { value: 'eventos', label: 'Eventos' },
  { value: 'contacto', label: 'Contacto' },
]

const PLACEMENT_LABEL = Object.fromEntries(PLACEMENTS.map((item) => [item.value, item.label]))

const EMPTY_FORM = {
  titulo: '',
  etiqueta: '',
  texto: '',
  enlace: '',
  ubicacion: 'inicio',
  orden: '1',
  estado: 'borrador',
  imagen: '',
}

export default function AdvertisingAdmin() {
  const { isAdmin, isEditor } = useAuth()
  const { items, loading } = useCollection('advertising', {
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

  const stats = useMemo(
    () => ({
      total: items.length,
      published: items.filter((item) => item.estado === 'publicado').length,
      draft: items.filter((item) => item.estado !== 'publicado').length,
    }),
    [items],
  )

  if (!isEditor) {
    return (
      <div className="border border-[#9b4a32]/25 bg-[#9b4a32]/5 p-8 text-center">
        <Icon name="lock" size={22} className="mx-auto text-[#9b4a32]" />
        <p className="mt-4 font-display text-2xl">Acceso restringido</p>
        <p className="mt-2 text-sm text-[#55645d]">
          La gestión de publicidad requiere una cuenta con rol editor o administrador.
        </p>
      </div>
    )
  }

  const openNew = () => {
    setForm({ ...EMPTY_FORM, orden: String(items.length + 1) })
    setErrors({})
    setEditing({ id: null })
  }

  const openEdit = (item) => {
    setForm({
      titulo: item.titulo || '',
      etiqueta: item.etiqueta || '',
      texto: item.texto || '',
      enlace: item.enlace || '',
      ubicacion: item.ubicacion || 'inicio',
      orden: String(item.orden ?? 1),
      estado: item.estado || 'borrador',
      imagen: item.imagen || '',
    })
    setErrors({})
    setEditing(item)
  }

  const validate = () => {
    const next = {}
    if (form.titulo.trim().length < 3) next.titulo = 'Escribe un título (mínimo 3 caracteres).'
    if (form.titulo.trim().length > 120) next.titulo = 'El título no puede superar 120 caracteres.'
    if (form.texto.trim().length > 600) next.texto = 'El texto no puede superar 600 caracteres.'
    if (form.enlace && !/^https?:\/\//i.test(form.enlace) && !form.enlace.startsWith('/')) {
      next.enlace = 'Usa una URL completa (https://…) o una ruta interna (/contacto).'
    }
    if (!Number.isInteger(Number(form.orden)) || Number(form.orden) < 0) {
      next.orden = 'El orden debe ser un número entero.'
    }
    setErrors(next)
    return Object.keys(next).length === 0
  }

  const handleSubmit = async (event) => {
    event.preventDefault()
    if (!validate()) return
    setSaving(true)
    try {
      const payload = {
        titulo: form.titulo.trim(),
        etiqueta: form.etiqueta.trim(),
        texto: form.texto.trim(),
        enlace: form.enlace.trim(),
        ubicacion: form.ubicacion,
        orden: Number(form.orden),
        estado: form.estado,
        imagen: form.imagen,
      }
      if (editing?.id) {
        await updateRecord('advertising', editing.id, payload)
        notify('Anuncio actualizado.')
      } else {
        await createRecord('advertising', payload)
        notify('Anuncio creado.')
      }
      setEditing(null)
    } catch (error) {
      console.error('[publicidad]', error)
      notify(error.message || 'No se pudo guardar el anuncio.', 'error')
    } finally {
      setSaving(false)
    }
  }

  const togglePublished = async (item) => {
    try {
      await updateRecord('advertising', item.id, {
        estado: item.estado === 'publicado' ? 'borrador' : 'publicado',
      })
      notify(item.estado === 'publicado' ? 'Anuncio oculto del sitio.' : 'Anuncio publicado.')
    } catch (error) {
      console.error('[publicidad]', error)
      notify(error.message || 'No se pudo cambiar la visibilidad.', 'error')
    }
  }

  const handleDelete = async () => {
    if (!pendingDelete) return
    setDeleting(true)
    try {
      await deleteRecord('advertising', pendingDelete.id)
      notify('Anuncio eliminado de Firestore.')
      setPendingDelete(null)
    } catch (error) {
      console.error('[publicidad]', error)
      notify(error.message || 'No se pudo eliminar el anuncio.', 'error')
    } finally {
      setDeleting(false)
    }
  }

  return (
    <div className="space-y-7">
      <AdminPageHeader
        eyebrow={isAdmin ? 'Contenido administrado' : 'Tu espacio de edición'}
        title="Gestión de publicidad"
        description="Anuncios, flyers y promociones que aparecen en la página pública. Lo que publiques con ubicación Inicio entra al álbum de publicidad de la semana en la portada."
        action={
          <AdminButton icon="plus" onClick={openNew}>
            Nuevo anuncio
          </AdminButton>
        }
      />

      <div className="grid gap-3 sm:grid-cols-3">
        {[
          { label: 'Anuncios totales', value: stats.total },
          { label: 'Publicados', value: stats.published },
          { label: 'Borradores', value: stats.draft },
        ].map((stat) => (
          <div key={stat.label} className="border border-[#25342e]/10 bg-white px-4 py-3">
            <p className="font-mono text-[0.52rem] uppercase tracking-[0.16em] text-[#7d8a82]">
              {stat.label}
            </p>
            <p className="mt-1 font-display text-3xl leading-none text-[#1f2a26]">{stat.value}</p>
          </div>
        ))}
      </div>

      {items.length === 0 && !loading ? (
        <EmptyState
          icon="sparkle"
          title="Todavía no hay anuncios"
          description="Crea el primer banner o promoción. Solo se mostrará en el sitio cuando esté publicado."
          action={
            <AdminButton icon="plus" onClick={openNew}>
              Crear anuncio
            </AdminButton>
          }
        />
      ) : (
        <div className="grid gap-4 sm:grid-cols-2">
          {items.map((item) => (
            <AdminCard key={item.id} className="group overflow-hidden">
              <div className="relative aspect-[16/9] overflow-hidden bg-[#25342e]/5">
                {item.imagen ? (
                  <img
                    src={item.imagen}
                    alt={item.titulo}
                    loading="lazy"
                    className="h-full w-full object-cover transition duration-500 group-hover:scale-[1.03]"
                  />
                ) : (
                  <span className="grid h-full w-full place-items-center text-[#7d8a82]">
                    <Icon name="image" size={26} />
                  </span>
                )}
                <div className="absolute top-2 left-2">
                  <StatusBadge status={item.estado} />
                </div>
              </div>

              <div className="p-4">
                <div className="flex items-start justify-between gap-3">
                  <div className="min-w-0">
                    <p className="truncate text-sm font-medium text-[#1f2a26]">{item.titulo}</p>
                    <p className="mt-1 font-mono text-[0.55rem] uppercase tracking-[0.14em] text-[#7d8a82]">
                      {PLACEMENT_LABEL[item.ubicacion] || 'Inicio'} · Orden {item.orden ?? '—'}
                    </p>
                  </div>
                  <div className="flex shrink-0 gap-1.5">
                    <IconButton
                      icon={item.estado === 'publicado' ? 'eye' : 'check'}
                      label={item.estado === 'publicado' ? 'Ocultar' : 'Publicar'}
                      onClick={() => togglePublished(item)}
                    />
                    <IconButton icon="pencil" label="Editar anuncio" onClick={() => openEdit(item)} />
                    <IconButton
                      icon="trash"
                      label="Eliminar anuncio"
                      tone="danger"
                      onClick={() => setPendingDelete(item)}
                    />
                  </div>
                </div>
                {item.texto && (
                  <p className="mt-2 line-clamp-2 text-xs leading-relaxed text-[#55645d]">
                    {item.texto}
                  </p>
                )}
              </div>
            </AdminCard>
          ))}
        </div>
      )}

      <Modal
        open={Boolean(editing)}
        title={editing?.id ? 'Editar anuncio' : 'Nuevo anuncio'}
        description="Los cambios se reflejan en el sitio en tiempo real cuando el anuncio está publicado."
        onClose={() => setEditing(null)}
        footer={
          <>
            <AdminButton variant="outline" onClick={() => setEditing(null)} disabled={saving}>
              Cancelar
            </AdminButton>
            <button
              type="submit"
              form="advertising-form"
              disabled={saving}
              className="inline-flex items-center gap-2 rounded-full bg-[#1f2a26] px-5 py-2.5 text-[0.65rem] font-medium uppercase tracking-[0.16em] text-[#f4efdf] disabled:opacity-50"
            >
              {saving ? 'Guardando…' : 'Guardar anuncio'}
            </button>
          </>
        }
      >
        <form id="advertising-form" onSubmit={handleSubmit} className="grid gap-5 sm:grid-cols-2">
          <Field label="Título" htmlFor="ad-titulo" error={errors.titulo} required className="sm:col-span-2">
            <TextInput
              id="ad-titulo"
              value={form.titulo}
              onChange={(event) => setForm((current) => ({ ...current, titulo: event.target.value }))}
              placeholder="Conferencia misionera 2026"
            />
          </Field>

          <Field label="Etiqueta" htmlFor="ad-etiqueta" hint="Aparece sobre el título.">
            <TextInput
              id="ad-etiqueta"
              value={form.etiqueta}
              onChange={(event) => setForm((current) => ({ ...current, etiqueta: event.target.value }))}
              placeholder="Promoción"
            />
          </Field>

          <Field label="Ubicación" htmlFor="ad-ubicacion" hint="En Inicio aparece dentro del álbum de publicidad de la semana.">
            <Select
              id="ad-ubicacion"
              value={form.ubicacion}
              onChange={(event) => setForm((current) => ({ ...current, ubicacion: event.target.value }))}
            >
              {PLACEMENTS.map((placement) => (
                <option key={placement.value} value={placement.value}>
                  {placement.label}
                </option>
              ))}
            </Select>
          </Field>

          <Field label="Texto" htmlFor="ad-texto" error={errors.texto} className="sm:col-span-2">
            <TextArea
              id="ad-texto"
              rows={3}
              value={form.texto}
              onChange={(event) => setForm((current) => ({ ...current, texto: event.target.value }))}
              placeholder="Describe la promoción o el anuncio."
            />
          </Field>

          <Field
            label="Enlace"
            htmlFor="ad-enlace"
            error={errors.enlace}
            hint="https://… o una ruta interna como /contacto."
            className="sm:col-span-2"
          >
            <TextInput
              id="ad-enlace"
              value={form.enlace}
              onChange={(event) => setForm((current) => ({ ...current, enlace: event.target.value }))}
              placeholder="https://…"
            />
          </Field>

          <Field label="Orden" htmlFor="ad-orden" error={errors.orden} hint="Menor número aparece primero.">
            <TextInput
              id="ad-orden"
              type="number"
              min="0"
              value={form.orden}
              onChange={(event) => setForm((current) => ({ ...current, orden: event.target.value }))}
            />
          </Field>

          <Field label="Estado" htmlFor="ad-estado">
            <Select
              id="ad-estado"
              value={form.estado}
              onChange={(event) => setForm((current) => ({ ...current, estado: event.target.value }))}
            >
              <option value="borrador">Borrador</option>
              <option value="publicado">Publicado</option>
            </Select>
          </Field>

          <div className="sm:col-span-2">
            <ImageUploader
              value={form.imagen}
              onChange={(url) => setForm((current) => ({ ...current, imagen: url }))}
              folder="advertising"
              label="Imagen del anuncio"
              hint="Para el álbum de la semana usa una imagen vertical (4:5). Se optimiza automáticamente."
            />
          </div>
        </form>
      </Modal>

      <ConfirmDialog
        open={Boolean(pendingDelete)}
        title="¿Eliminar este anuncio?"
        description={`Se eliminará “${pendingDelete?.titulo || 'este anuncio'}” de Firestore y dejará de mostrarse en el sitio.`}
        loading={deleting}
        onConfirm={handleDelete}
        onCancel={() => setPendingDelete(null)}
      />
    </div>
  )
}
