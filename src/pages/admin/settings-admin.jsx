import { useEffect, useState } from 'react'
import {
  AdminButton,
  AdminCard,
  AdminPageHeader,
} from '../../components/admin/admin-page'
import ImageUploader from '../../components/admin/image-uploader'
import { Field, TextArea, TextInput } from '../../components/admin/field'
import { Icon } from '../../components/common/icons'
import { useAuth } from '../../context/auth-context'
import { useToast } from '../../context/toast-context'
import { useDocument } from '../../hooks/use-collection'
import { saveSettings } from '../../services/content'
import { DEFAULT_SETTINGS } from '../../data/content'

function hydrate(data) {
  return {
    ...DEFAULT_SETTINGS,
    ...data,
    redesSociales: {
      ...DEFAULT_SETTINGS.redesSociales,
      ...(data?.redesSociales || {}),
    },
    pastores: data?.pastores?.length ? data.pastores : DEFAULT_SETTINGS.pastores,
    horarios: data?.horarios?.length ? data.horarios : DEFAULT_SETTINGS.horarios,
  }
}

export default function SettingsAdmin() {
  const { isAdmin } = useAuth()
  const { data } = useDocument('settings', 'main', DEFAULT_SETTINGS)
  const { notify } = useToast()

  const [form, setForm] = useState(() => hydrate(data))
  const [saving, setSaving] = useState(false)

  useEffect(() => {
    setForm(hydrate(data))
  }, [data])

  if (!isAdmin) {
    return (
      <div className="border border-[#9b4a32]/25 bg-[#9b4a32]/5 p-8 text-center">
        <Icon name="lock" size={22} className="mx-auto text-[#9b4a32]" />
        <p className="mt-4 font-display text-2xl">Solo administradores</p>
        <p className="mt-2 text-sm text-[#55645d]">
          La configuración general y los roles están reservados al rol administrador.
        </p>
      </div>
    )
  }

  const update = (field) => (event) =>
    setForm((current) => ({ ...current, [field]: event.target.value }))

  const updateSocial = (key) => (event) =>
    setForm((current) => ({
      ...current,
      redesSociales: { ...current.redesSociales, [key]: event.target.value },
    }))

  const updatePastor = (index, field, value) =>
    setForm((current) => ({
      ...current,
      pastores: current.pastores.map((item, position) =>
        position === index ? { ...item, [field]: value } : item,
      ),
    }))

  const updateSchedule = (index, field, value) =>
    setForm((current) => ({
      ...current,
      horarios: current.horarios.map((item, position) =>
        position === index ? { ...item, [field]: value } : item,
      ),
    }))

  const addSchedule = () =>
    setForm((current) => ({
      ...current,
      horarios: [...current.horarios, { dia: '', hora: '', detalle: '' }],
    }))

  const removeSchedule = (index) =>
    setForm((current) => ({
      ...current,
      horarios: current.horarios.filter((_, position) => position !== index),
    }))

  const handleSubmit = async (event) => {
    event.preventDefault()
    setSaving(true)
    try {
      await saveSettings({
        ...form,
        horarios: form.horarios.filter((item) => item.dia.trim() || item.hora.trim()),
      })
      notify('Configuración guardada. El sitio ya muestra los cambios.')
    } catch (error) {
      console.error(error)
      notify(error.message || 'No se pudo guardar la configuración.', 'error')
    } finally {
      setSaving(false)
    }
  }

  return (
    <div className="space-y-7">
      <AdminPageHeader
        eyebrow="Sistema"
        title="Configuración general"
        description="Identidad, contacto, redes sociales y horarios. Estos datos alimentan el encabezado, el pie de página, el formulario y el botón de WhatsApp."
      />

      <form onSubmit={handleSubmit} className="space-y-6">
        <AdminCard className="p-6">
          <h2 className="font-display text-xl text-[#1f2a26]">Identidad de la iglesia</h2>
          <div className="mt-5 grid gap-5 sm:grid-cols-2">
            <Field label="Nombre de la iglesia" htmlFor="settings-nombre">
              <TextInput id="settings-nombre" value={form.nombreIglesia} onChange={update('nombreIglesia')} />
            </Field>
            <Field label="Lema" htmlFor="settings-lema">
              <TextInput id="settings-lema" value={form.lema} onChange={update('lema')} />
            </Field>
            <Field label="Descripción breve" htmlFor="settings-descripcion" className="sm:col-span-2">
              <TextArea
                id="settings-descripcion"
                rows={3}
                value={form.descripcion}
                onChange={update('descripcion')}
              />
            </Field>
            <Field
              label="Información general"
              htmlFor="settings-info"
              hint="Se muestra en la página Nosotros cuando se amplíe el contenido."
              className="sm:col-span-2"
            >
              <TextArea
                id="settings-info"
                rows={4}
                value={form.informacionGeneral}
                onChange={update('informacionGeneral')}
              />
            </Field>
            <div className="sm:col-span-2">
              <ImageUploader
                value={form.logo}
                onChange={(url) => setForm((current) => ({ ...current, logo: url }))}
                folder="settings"
                label="Logotipo"
                hint="Se usa en la navegación, el pie de página y el panel."
              />
            </div>
          </div>
        </AdminCard>

        <AdminCard className="p-6">
          <h2 className="font-display text-xl text-[#1f2a26]">Pastores</h2>
          <div className="mt-5 grid gap-5 sm:grid-cols-2">
            {form.pastores.map((pastor, index) => (
              <div key={index} className="grid gap-4 border border-[#25342e]/10 bg-[#faf7ea] p-4 sm:grid-cols-2">
                <Field label="Nombre" htmlFor={`pastor-nombre-${index}`}>
                  <TextInput
                    id={`pastor-nombre-${index}`}
                    value={pastor.nombre}
                    onChange={(event) => updatePastor(index, 'nombre', event.target.value)}
                    placeholder="Nombre completo"
                  />
                </Field>
                <Field label="Cargo" htmlFor={`pastor-cargo-${index}`}>
                  <TextInput
                    id={`pastor-cargo-${index}`}
                    value={pastor.cargo || ''}
                    onChange={(event) => updatePastor(index, 'cargo', event.target.value)}
                    placeholder="Pastor"
                  />
                </Field>
              </div>
            ))}
          </div>
          <p className="mt-3 text-xs text-[#7d8a82]">
            Se muestran en la página Nosotros, en la sección de identidad.
          </p>
        </AdminCard>

        <AdminCard className="p-6">
          <h2 className="font-display text-xl text-[#1f2a26]">Contacto y ubicación</h2>
          <div className="mt-5 grid gap-5 sm:grid-cols-2">
            <Field label="Dirección" htmlFor="settings-direccion" className="sm:col-span-2">
              <TextInput
                id="settings-direccion"
                value={form.direccion}
                onChange={update('direccion')}
                placeholder="Dirección oficial de la iglesia"
              />
            </Field>
            <Field label="Teléfono" htmlFor="settings-telefono">
              <TextInput
                id="settings-telefono"
                value={form.telefono}
                onChange={update('telefono')}
                placeholder="+502 …"
              />
            </Field>
            <Field label="WhatsApp" htmlFor="settings-whatsapp" hint="Solo números. Activa el botón flotante.">
              <TextInput
                id="settings-whatsapp"
                value={form.whatsapp}
                onChange={update('whatsapp')}
                placeholder="50212345678"
              />
            </Field>
            <Field label="Correo electrónico" htmlFor="settings-correo">
              <TextInput
                id="settings-correo"
                type="email"
                value={form.correo}
                onChange={update('correo')}
                placeholder="contacto@iglesia.com"
              />
            </Field>
            <Field
              label="URL de Google Maps (embed)"
              htmlFor="settings-mapa"
              hint="Copia el enlace de inserción del mapa. Si está vacío, el sitio muestra un aviso."
            >
              <TextInput
                id="settings-mapa"
                value={form.mapaUrl}
                onChange={update('mapaUrl')}
                placeholder="https://www.google.com/maps/embed?pb=…"
              />
            </Field>
          </div>
        </AdminCard>

        <AdminCard className="p-6">
          <h2 className="font-display text-xl text-[#1f2a26]">Redes sociales</h2>
          <div className="mt-5 grid gap-5 sm:grid-cols-2">
            {[
              { key: 'facebook', label: 'Facebook' },
              { key: 'instagram', label: 'Instagram' },
              { key: 'youtube', label: 'YouTube' },
              { key: 'tiktok', label: 'TikTok' },
            ].map((social) => (
              <Field key={social.key} label={social.label} htmlFor={`settings-${social.key}`}>
                <TextInput
                  id={`settings-${social.key}`}
                  type="url"
                  value={form.redesSociales[social.key] || ''}
                  onChange={updateSocial(social.key)}
                  placeholder={`https://…`}
                />
              </Field>
            ))}
          </div>
        </AdminCard>

        <AdminCard className="p-6">
          <div className="flex items-center justify-between gap-4">
            <h2 className="font-display text-xl text-[#1f2a26]">Horarios de reunión</h2>
            <AdminButton variant="outline" icon="plus" onClick={addSchedule}>
              Añadir
            </AdminButton>
          </div>

          <div className="mt-5 space-y-3">
            {form.horarios.map((item, index) => (
              <div key={index} className="grid gap-3 border border-[#25342e]/10 bg-[#faf7ea] p-4 sm:grid-cols-[1fr_1fr_1.2fr_auto] sm:items-end">
                <Field label="Día" htmlFor={`horario-dia-${index}`}>
                  <TextInput
                    id={`horario-dia-${index}`}
                    value={item.dia}
                    onChange={(event) => updateSchedule(index, 'dia', event.target.value)}
                    placeholder="Domingo"
                  />
                </Field>
                <Field label="Hora" htmlFor={`horario-hora-${index}`}>
                  <TextInput
                    id={`horario-hora-${index}`}
                    value={item.hora}
                    onChange={(event) => updateSchedule(index, 'hora', event.target.value)}
                    placeholder="9:00 AM"
                  />
                </Field>
                <Field label="Detalle" htmlFor={`horario-detalle-${index}`}>
                  <TextInput
                    id={`horario-detalle-${index}`}
                    value={item.detalle || ''}
                    onChange={(event) => updateSchedule(index, 'detalle', event.target.value)}
                    placeholder="Culto de celebración"
                  />
                </Field>
                <button
                  type="button"
                  onClick={() => removeSchedule(index)}
                  aria-label="Eliminar horario"
                  className="mb-1 grid h-9 w-9 place-items-center rounded-full border border-[#9b4a32]/25 text-[#9b4a32] transition hover:bg-[#9b4a32]/5"
                >
                  <Icon name="trash" size={14} />
                </button>
              </div>
            ))}
          </div>
        </AdminCard>

        <div className="sticky bottom-4 flex items-center justify-end gap-3 border border-[#25342e]/10 bg-[#faf7ea]/95 p-4 backdrop-blur">
          <p className="mr-auto text-xs text-[#7d8a82]">
            Los cambios se publican inmediatamente en el sitio.
          </p>
          <button
            type="submit"
            disabled={saving}
            className="inline-flex items-center gap-2 rounded-full bg-[#1f2a26] px-6 py-3 text-[0.65rem] font-medium uppercase tracking-[0.16em] text-[#f4efdf] disabled:opacity-50"
          >
            {saving ? 'Guardando…' : 'Guardar configuración'}
            <Icon name="check" size={14} />
          </button>
        </div>
      </form>
    </div>
  )
}
