import { useState } from 'react'
import {
  AdminButton,
  AdminCard,
  AdminPageHeader,
  EmptyState,
  IconButton,
} from '../../components/admin/admin-page'
import Modal from '../../components/admin/modal'
import { Field, Select, TextInput } from '../../components/admin/field'
import { Icon } from '../../components/common/icons'
import { useAuth } from '../../context/auth-context'
import { useToast } from '../../context/toast-context'
import { useCollection } from '../../hooks/use-collection'
import { createStaffUser } from '../../services/auth'
import { formatShortDate } from '../../utils/dates'

const ROLES = [
  { value: 'administrador', label: 'Administrador', description: 'Acceso completo, configuración y usuarios.' },
  { value: 'editor', label: 'Editor', description: 'Eventos, ministerios, historia, galería y mensajes.' },
  { value: 'publico', label: 'Público', description: 'Solo lectura del sitio; sin acceso al panel.' },
]

const EMPTY_FORM = { nombre: '', email: '', password: '', rol: 'editor' }

export default function UsersAdmin() {
  const { isAdmin, user, changeRole } = useAuth()
  const { items, loading } = useCollection('users', {
    order: ['fechaCreacion', 'desc'],
    fallback: [],
  })
  const { notify } = useToast()

  const [busyUid, setBusyUid] = useState(null)
  const [openCreate, setOpenCreate] = useState(false)
  const [form, setForm] = useState(EMPTY_FORM)
  const [creating, setCreating] = useState(false)
  const [error, setError] = useState('')

  if (!isAdmin) {
    return (
      <div className="border border-[#9b4a32]/25 bg-[#9b4a32]/5 p-8 text-center">
        <Icon name="lock" size={22} className="mx-auto text-[#9b4a32]" />
        <p className="mt-4 font-display text-2xl">Solo administradores</p>
        <p className="mt-2 text-sm text-[#55645d]">
          La gestión de usuarios y permisos está reservada al rol administrador.
        </p>
      </div>
    )
  }

  const handleRoleChange = async (uid, rol) => {
    setBusyUid(uid)
    try {
      await changeRole(uid, rol)
      notify('Rol actualizado. El usuario verá los cambios al recargar su sesión.')
    } catch (roleError) {
      console.error(roleError)
      notify(roleError.message || 'No se pudo actualizar el rol.', 'error')
    } finally {
      setBusyUid(null)
    }
  }

  const handleCreate = async (event) => {
    event.preventDefault()
    setError('')

    if (!form.nombre.trim() || !form.email.trim() || form.password.length < 8) {
      setError('Completa nombre, correo y una contraseña de al menos 8 caracteres.')
      return
    }

    setCreating(true)
    try {
      await createStaffUser({
        nombre: form.nombre.trim(),
        email: form.email.trim(),
        password: form.password,
        rol: form.rol,
      })
      notify('Cuenta creada. Comparte la contraseña temporal de forma segura.')
      setForm(EMPTY_FORM)
      setOpenCreate(false)
    } catch (createError) {
      console.error(createError)
      setError(
        createError.code === 'functions/not-found'
          ? 'La función createStaffUser no está desplegada. Publica las Cloud Functions para crear cuentas desde aquí.'
          : createError.message || 'No se pudo crear la cuenta.',
      )
    } finally {
      setCreating(false)
    }
  }

  return (
    <div className="space-y-7">
      <AdminPageHeader
        eyebrow="Sistema"
        title="Usuarios y roles"
        description="Administra quién puede editar el contenido. Los roles se validan en el frontend y en las reglas de Firestore y Storage."
        action={
          <AdminButton icon="plus" onClick={() => setOpenCreate(true)}>
            Crear cuenta
          </AdminButton>
        }
      />

      <div className="border border-[#e6c9a1]/30 bg-[#e6c9a1]/10 p-4 text-xs leading-relaxed text-[#6d5c3b]">
        <strong>Primer administrador:</strong> créalo en Firebase Authentication y luego agrega el
        documento <code className="rounded bg-black/5 px-1">users/&#123;uid&#125;</code> con{' '}
        <code className="rounded bg-black/5 px-1">nombre</code>,{' '}
        <code className="rounded bg-black/5 px-1">email</code>,{' '}
        <code className="rounded bg-black/5 px-1">rol: &quot;administrador&quot;</code> y{' '}
        <code className="rounded bg-black/5 px-1">fechaCreacion</code>. Después podrá crear las
        demás cuentas desde este panel.
      </div>

      {items.length === 0 && !loading ? (
        <EmptyState
          icon="users"
          title="No hay perfiles todavía"
          description="Los perfiles aparecen aquí cuando existe un documento en la colección users."
        />
      ) : (
        <AdminCard className="overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full min-w-[640px] text-left text-sm">
              <thead className="border-b border-[#25342e]/10 bg-[#faf7ea] text-[0.58rem] uppercase tracking-[0.16em] text-[#5f6d66]">
                <tr>
                  <th className="px-4 py-3 font-medium">Persona</th>
                  <th className="px-4 py-3 font-medium">Correo</th>
                  <th className="px-4 py-3 font-medium">Alta</th>
                  <th className="px-4 py-3 font-medium">Rol</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#25342e]/8">
                {items.map((profile) => {
                  const isSelf = profile.id === user?.uid
                  return (
                    <tr key={profile.id} className="transition hover:bg-[#faf7ea]/60">
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-2 font-medium text-[#25342e]">
                          {profile.nombre || 'Sin nombre'}
                          {isSelf && (
                            <span className="rounded-full bg-[#25342e]/5 px-2 py-0.5 text-[0.5rem] uppercase tracking-[0.12em] text-[#7d8a82]">
                              Tú
                            </span>
                          )}
                        </div>
                      </td>
                      <td className="px-4 py-3 text-xs text-[#55645d]">{profile.email}</td>
                      <td className="px-4 py-3 font-mono text-[0.62rem] text-[#7d8a82]">
                        {formatShortDate(profile.fechaCreacion) || '—'}
                      </td>
                      <td className="px-4 py-3">
                        <select
                          value={profile.rol || 'publico'}
                          disabled={isSelf || busyUid === profile.id}
                          onChange={(event) => handleRoleChange(profile.id, event.target.value)}
                          className="admin-input py-1.5 text-xs disabled:opacity-60"
                          aria-label={`Rol de ${profile.nombre || profile.email}`}
                        >
                          {ROLES.map((role) => (
                            <option key={role.value} value={role.value}>
                              {role.label}
                            </option>
                          ))}
                        </select>
                      </td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          </div>
        </AdminCard>
      )}

      <div className="grid gap-3 sm:grid-cols-3">
        {ROLES.map((role) => (
          <div key={role.value} className="border border-[#25342e]/10 bg-white p-4">
            <p className="flex items-center gap-2 text-sm font-medium text-[#25342e]">
              <Icon name="lock" size={14} className="text-[#547972]" />
              {role.label}
            </p>
            <p className="mt-1.5 text-xs leading-relaxed text-[#7d8a82]">{role.description}</p>
          </div>
        ))}
      </div>

      <Modal
        open={openCreate}
        title="Crear cuenta de equipo"
        description="Requiere las Cloud Functions desplegadas (Admin SDK)."
        onClose={() => setOpenCreate(false)}
        footer={
          <>
            <AdminButton variant="outline" onClick={() => setOpenCreate(false)} disabled={creating}>
              Cancelar
            </AdminButton>
            <button
              type="submit"
              form="create-user-form"
              disabled={creating}
              className="inline-flex items-center gap-2 rounded-full bg-[#1f2a26] px-5 py-2.5 text-[0.65rem] font-medium uppercase tracking-[0.16em] text-[#f4efdf] disabled:opacity-50"
            >
              {creating ? 'Creando…' : 'Crear cuenta'}
            </button>
          </>
        }
      >
        <form id="create-user-form" onSubmit={handleCreate} className="grid gap-5 sm:grid-cols-2">
          <Field label="Nombre completo" htmlFor="user-nombre" required>
            <TextInput
              id="user-nombre"
              value={form.nombre}
              onChange={(event) => setForm((current) => ({ ...current, nombre: event.target.value }))}
            />
          </Field>

          <Field label="Correo" htmlFor="user-email" required>
            <TextInput
              id="user-email"
              type="email"
              value={form.email}
              onChange={(event) => setForm((current) => ({ ...current, email: event.target.value }))}
            />
          </Field>

          <Field label="Contraseña temporal" htmlFor="user-password" hint="Mínimo 8 caracteres." required>
            <TextInput
              id="user-password"
              type="text"
              value={form.password}
              onChange={(event) => setForm((current) => ({ ...current, password: event.target.value }))}
            />
          </Field>

          <Field label="Rol" htmlFor="user-rol">
            <Select
              id="user-rol"
              value={form.rol}
              onChange={(event) => setForm((current) => ({ ...current, rol: event.target.value }))}
            >
              <option value="editor">Editor</option>
              <option value="administrador">Administrador</option>
            </Select>
          </Field>

          {error && (
            <p className="border border-[#9b4a32]/25 bg-[#9b4a32]/5 p-3 text-xs leading-relaxed text-[#9b4a32] sm:col-span-2">
              {error}
            </p>
          )}
        </form>
      </Modal>

      <p className="text-xs leading-relaxed text-[#7d8a82]">
        <Icon name="lock" size={12} className="mr-1 inline" />
        Las contraseñas se envían directamente a Firebase Authentication. No se guardan en
        Firestore ni en el código del sitio.
      </p>
    </div>
  )
}
