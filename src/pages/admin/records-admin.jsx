import { useEffect, useMemo, useState } from 'react'
import {
  AdminButton,
  AdminCard,
  AdminPageHeader,
  EmptyState,
  IconButton,
} from '../../components/admin/admin-page'
import Modal from '../../components/admin/modal'
import ConfirmDialog from '../../components/admin/confirm-dialog'
import { Field, Select, TextArea, TextInput } from '../../components/admin/field'
import { Icon } from '../../components/common/icons'
import { useAuth } from '../../context/auth-context'
import { useToast } from '../../context/toast-context'
import { useCollection } from '../../hooks/use-collection'
import {
  createFormRecord,
  deleteFormRecord,
  updateFormRecord,
  validateRecord,
} from '../../services/records'
import { toDate } from '../../utils/dates'
import { exportRecordsCsv, exportRecordsXlsx } from '../../utils/export'

const PAGE_SIZES = [10, 25, 50]

const STATUS_OPTIONS = [
  { value: 'nuevo', label: 'Nuevo' },
  { value: 'leido', label: 'Leído' },
  { value: 'archivado', label: 'Archivado' },
]

const STATUS_LABEL = Object.fromEntries(STATUS_OPTIONS.map((item) => [item.value, item.label]))

const STATUS_STYLES = {
  nuevo: 'bg-[#e6c9a1]/20 text-[#547972]',
  leido: 'bg-[#3f6b52]/10 text-[#3f6b52]',
  archivado: 'bg-[#25342e]/8 text-[#55645d]',
}

const ORIGIN_OPTIONS = [
  { value: 'todos', label: 'Todos los orígenes' },
  { value: 'sitio-web', label: 'Sitio web' },
  { value: 'panel-admin', label: 'Panel administrativo' },
]

const ORIGIN_LABEL = {
  'sitio-web': 'Sitio web',
  'panel-admin': 'Panel administrativo',
}

const EMPTY_FORM = {
  nombre: '',
  email: '',
  telefono: '',
  asunto: '',
  estado: 'nuevo',
  mensaje: '',
}

const SORT_COLUMNS = [
  { key: 'nombre', label: 'Persona' },
  { key: 'email', label: 'Correo' },
  { key: 'asunto', label: 'Asunto' },
  { key: 'estado', label: 'Estado' },
  { key: 'fecha', label: 'Fecha' },
]

function formatDateTime(value) {
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

function dateParts(value) {
  const date = toDate(value)
  if (!date) return { date: '—', time: '' }
  return {
    date: date.toLocaleDateString('es-GT', {
      day: '2-digit',
      month: 'short',
      year: 'numeric',
    }),
    time: date.toLocaleTimeString('es-GT', { hour: '2-digit', minute: '2-digit' }),
  }
}

function StatusBadge({ estado }) {
  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-[0.58rem] font-medium uppercase tracking-[0.1em] ${
        STATUS_STYLES[estado] || STATUS_STYLES.archivado
      }`}
    >
      {STATUS_LABEL[estado] || estado || 'Sin estado'}
    </span>
  )
}

function SortHeader({ column, label, sort, onSort }) {
  const active = sort.key === column
  return (
    <th
      className="px-4 py-3 font-medium whitespace-nowrap"
      aria-sort={active ? (sort.dir === 'asc' ? 'ascending' : 'descending') : 'none'}
    >
      <button
        type="button"
        onClick={() => onSort(column)}
        className={`inline-flex items-center gap-1.5 text-[0.58rem] uppercase tracking-[0.16em] transition hover:text-[#1f2a26] ${
          active ? 'text-[#1f2a26]' : ''
        }`}
      >
        {label}
        <Icon
          name="chevron-down"
          size={11}
          className={`transition ${active ? 'opacity-90' : 'opacity-35'} ${
            active && sort.dir === 'asc' ? 'rotate-180' : ''
          }`}
        />
      </button>
    </th>
  )
}

function Detail({ label, children, mono = false }) {
  return (
    <div>
      <p className="font-mono text-[0.54rem] uppercase tracking-[0.16em] text-[#7d8a82]">{label}</p>
      <div className={`mt-1 break-words text-[#25342e] ${mono ? 'font-mono text-[0.7rem]' : 'text-sm'}`}>
        {children}
      </div>
    </div>
  )
}

export default function RecordsAdmin() {
  const { isAdmin } = useAuth()
  const { items, loading, error } = useCollection('contact_messages', {
    enabled: isAdmin,
    order: ['fecha', 'desc'],
    fallback: [],
  })
  const { notify } = useToast()

  const [search, setSearch] = useState('')
  const [status, setStatus] = useState('todos')
  const [origin, setOrigin] = useState('todos')
  const [sort, setSort] = useState({ key: 'fecha', dir: 'desc' })
  const [page, setPage] = useState(1)
  const [pageSize, setPageSize] = useState(10)

  const [detailId, setDetailId] = useState(null)
  const [editor, setEditor] = useState(null)
  const [form, setForm] = useState(EMPTY_FORM)
  const [errors, setErrors] = useState({})
  const [saving, setSaving] = useState(false)
  const [pendingDelete, setPendingDelete] = useState(null)
  const [deleting, setDeleting] = useState(false)
  const [exporting, setExporting] = useState('')

  useEffect(() => {
    setPage(1)
  }, [search, status, origin, pageSize])

  const detail = useMemo(
    () => items.find((record) => record.id === detailId) ?? null,
    [items, detailId],
  )

  const counts = useMemo(() => {
    const base = { total: items.length, nuevo: 0, leido: 0, archivado: 0 }
    items.forEach((record) => {
      if (record.estado in base) base[record.estado] += 1
    })
    return base
  }, [items])

  const filtered = useMemo(() => {
    const term = search.trim().toLowerCase()
    return items.filter((record) => {
      const recordOrigin = record.origen || 'sitio-web'
      if (status !== 'todos' && record.estado !== status) return false
      if (origin !== 'todos' && recordOrigin !== origin) return false
      if (!term) return true
      return [
        record.nombre,
        record.email,
        record.asunto,
        record.mensaje,
        record.telefono,
        record.id,
        record.estado,
        recordOrigin,
      ].some((value) => String(value ?? '').toLowerCase().includes(term))
    })
  }, [items, search, status, origin])

  const sorted = useMemo(() => {
    const direction = sort.dir === 'asc' ? 1 : -1
    const valueOf = (record, key) => {
      if (key === 'fecha') {
        return toDate(record.fecha ?? record.fechaCreacion)?.getTime() ?? 0
      }
      return String(record[key] ?? '').toLowerCase()
    }

    return [...filtered].sort((a, b) => {
      const left = valueOf(a, sort.key)
      const right = valueOf(b, sort.key)
      if (left < right) return -1 * direction
      if (left > right) return 1 * direction
      return (toDate(b.fecha)?.getTime() ?? 0) - (toDate(a.fecha)?.getTime() ?? 0)
    })
  }, [filtered, sort])

  const totalPages = Math.max(1, Math.ceil(sorted.length / pageSize))
  const currentPage = Math.min(page, totalPages)
  const startIndex = (currentPage - 1) * pageSize
  const pageItems = sorted.slice(startIndex, startIndex + pageSize)
  const rangeStart = sorted.length === 0 ? 0 : startIndex + 1
  const rangeEnd = Math.min(startIndex + pageSize, sorted.length)

  const pageNumbers = useMemo(() => {
    if (totalPages <= 5) {
      return Array.from({ length: totalPages }, (_, index) => index + 1)
    }
    const start = Math.max(1, Math.min(currentPage - 2, totalPages - 4))
    return Array.from({ length: 5 }, (_, index) => start + index)
  }, [totalPages, currentPage])

  const hasFilters = Boolean(search.trim()) || status !== 'todos' || origin !== 'todos'

  const clearFilters = () => {
    setSearch('')
    setStatus('todos')
    setOrigin('todos')
  }

  const handleSort = (key) => {
    setSort((current) =>
      current.key === key
        ? { key, dir: current.dir === 'asc' ? 'desc' : 'asc' }
        : { key, dir: key === 'fecha' ? 'desc' : 'asc' },
    )
    setPage(1)
  }

  const openCreate = () => {
    setForm(EMPTY_FORM)
    setErrors({})
    setEditor({ mode: 'create', record: null })
  }

  const openEdit = (record) => {
    setDetailId(null)
    setForm({
      nombre: record.nombre || '',
      email: record.email || '',
      telefono: record.telefono || '',
      asunto: record.asunto || '',
      estado: record.estado || 'nuevo',
      mensaje: record.mensaje || '',
    })
    setErrors({})
    setEditor({ mode: 'edit', record })
  }

  const updateField = (field) => (event) => {
    setForm((current) => ({ ...current, [field]: event.target.value }))
    setErrors((current) => ({ ...current, [field]: undefined }))
  }

  const handleSubmit = async (event) => {
    event.preventDefault()
    if (saving) return

    const validation = validateRecord(form)
    setErrors(validation)
    if (Object.keys(validation).length) return

    setSaving(true)
    try {
      if (editor?.mode === 'edit' && editor.record) {
        await updateFormRecord(editor.record.id, form)
        notify('Registro actualizado en Firestore.')
      } else {
        await createFormRecord(form)
        notify('Registro creado y guardado en Firestore.')
      }
      setEditor(null)
      setForm(EMPTY_FORM)
      setErrors({})
    } catch (saveError) {
      console.error('[registros]', saveError)
      if (saveError.fieldErrors) setErrors(saveError.fieldErrors)
      notify(saveError.message || 'No se pudo guardar el registro.', 'error')
    } finally {
      setSaving(false)
    }
  }

  const handleDelete = async () => {
    if (!pendingDelete) return
    setDeleting(true)
    try {
      await deleteFormRecord(pendingDelete.id)
      notify('Registro eliminado de Firestore.')
      if (detailId === pendingDelete.id) setDetailId(null)
      setPendingDelete(null)
    } catch (deleteError) {
      console.error('[registros]', deleteError)
      notify(deleteError.message || 'No se pudo eliminar el registro.', 'error')
    } finally {
      setDeleting(false)
    }
  }

  const copyId = async (id) => {
    try {
      await navigator.clipboard.writeText(id)
      notify('ID del documento copiado.')
    } catch {
      notify('No se pudo copiar el ID. Puedes seleccionarlo manualmente.', 'error')
    }
  }

  const handleExportCsv = () => {
    try {
      exportRecordsCsv(sorted)
      notify(`CSV generado con ${sorted.length} registros.`)
    } catch (exportError) {
      notify(exportError.message || 'No se pudo exportar el CSV.', 'error')
    }
  }

  const handleExportXlsx = async () => {
    if (exporting) return
    setExporting('xlsx')
    try {
      await exportRecordsXlsx(sorted)
      notify(`Excel generado con ${sorted.length} registros.`)
    } catch (exportError) {
      console.error('[exportar]', exportError)
      notify(exportError.message || 'No se pudo exportar el Excel.', 'error')
    } finally {
      setExporting('')
    }
  }

  if (!isAdmin) {
    return (
      <div className="mx-auto max-w-xl border border-[#9b4a32]/25 bg-[#9b4a32]/5 p-8 text-center">
        <span className="mx-auto grid h-12 w-12 place-items-center rounded-full bg-[#9b4a32]/10 text-[#9b4a32]">
          <Icon name="lock" size={22} />
        </span>
        <p className="mt-4 font-display text-2xl text-[#1f2a26]">Solo administradores</p>
        <p className="mt-2 text-sm leading-relaxed text-[#55645d]">
          La gestión de registros está reservada al administrador. Los editores de publicidad no
          pueden consultar ni modificar los datos enviados desde los formularios.
        </p>
      </div>
    )
  }

  return (
    <div className="space-y-7">
      <AdminPageHeader
        eyebrow="Solo administrador"
        title="Gestión de registros"
        description="Todos los envíos de los formularios del sitio, guardados en Cloud Firestore. Busca, filtra, ordena, edita y elimina registros; la tabla se actualiza en tiempo real."
        action={
          <div className="flex flex-wrap items-center gap-2">
            <AdminButton
              variant="outline"
              icon="download"
              onClick={handleExportCsv}
              disabled={sorted.length === 0}
            >
              CSV
            </AdminButton>
            <AdminButton
              variant="outline"
              icon="download"
              onClick={handleExportXlsx}
              disabled={sorted.length === 0 || exporting === 'xlsx'}
            >
              {exporting === 'xlsx' ? 'Generando…' : 'Excel'}
            </AdminButton>
            <AdminButton icon="plus" onClick={openCreate}>
              Nuevo registro
            </AdminButton>
          </div>
        }
      />

      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
        {[
          { label: 'Total de registros', value: counts.total, tone: 'text-[#1f2a26]' },
          { label: 'Nuevos', value: counts.nuevo, tone: 'text-[#547972]' },
          { label: 'Leídos', value: counts.leido, tone: 'text-[#3f6b52]' },
          { label: 'Archivados', value: counts.archivado, tone: 'text-[#55645d]' },
        ].map((stat) => (
          <div key={stat.label} className="border border-[#25342e]/10 bg-white px-4 py-3">
            <p className="font-mono text-[0.52rem] uppercase tracking-[0.16em] text-[#7d8a82]">
              {stat.label}
            </p>
            <p className={`mt-1 font-display text-3xl leading-none ${stat.tone}`}>{stat.value}</p>
          </div>
        ))}
      </div>

      <AdminCard className="p-4">
        <div className="flex flex-col gap-3 lg:flex-row lg:items-center">
          <div className="relative flex-1">
            <Icon
              name="search"
              size={15}
              className="pointer-events-none absolute top-1/2 left-3 -translate-y-1/2 text-[#7d8a82]"
            />
            <input
              type="search"
              value={search}
              onChange={(event) => setSearch(event.target.value)}
              placeholder="Buscar por nombre, correo, asunto, mensaje, teléfono o ID…"
              aria-label="Buscar registros"
              className="admin-input pl-9"
            />
          </div>

          <div className="grid grid-cols-2 gap-2 sm:flex sm:flex-wrap">
            <Select
              value={status}
              onChange={(event) => setStatus(event.target.value)}
              aria-label="Filtrar por estado"
              className="text-xs"
            >
              <option value="todos">Todos los estados</option>
              {STATUS_OPTIONS.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </Select>

            <Select
              value={origin}
              onChange={(event) => setOrigin(event.target.value)}
              aria-label="Filtrar por origen"
              className="text-xs"
            >
              {ORIGIN_OPTIONS.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </Select>

            <Select
              value={pageSize}
              onChange={(event) => setPageSize(Number(event.target.value))}
              aria-label="Registros por página"
              className="text-xs"
            >
              {PAGE_SIZES.map((size) => (
                <option key={size} value={size}>
                  {size} por página
                </option>
              ))}
            </Select>

            {hasFilters && (
              <button
                type="button"
                onClick={clearFilters}
                className="rounded-full border border-[#25342e]/15 px-3 py-2 text-[0.6rem] font-medium uppercase tracking-[0.12em] text-[#55645d] transition hover:border-[#25342e]/40 hover:text-[#25342e]"
              >
                Limpiar
              </button>
            )}
          </div>
        </div>
      </AdminCard>

      {error && (
        <div className="border border-[#9b4a32]/25 bg-[#9b4a32]/5 p-4 text-xs leading-relaxed text-[#9b4a32]">
          <strong className="font-medium">No se pudieron leer los registros:</strong> {error}. Revisa
          que tu cuenta tenga el rol administrador y que las reglas de Firestore estén publicadas.
        </div>
      )}

      <AdminCard className="overflow-hidden">
        <div className="flex flex-wrap items-center justify-between gap-3 border-b border-[#25342e]/10 px-4 py-3">
          <p className="text-xs text-[#55645d]">
            Mostrando <span className="font-medium text-[#25342e]">{rangeStart}</span>–
            <span className="font-medium text-[#25342e]">{rangeEnd}</span> de{' '}
            <span className="font-medium text-[#25342e]">{sorted.length}</span> registros
          </p>
          <span className="inline-flex items-center gap-2 font-mono text-[0.55rem] uppercase tracking-[0.16em] text-[#3f6b52]">
            <span className="relative flex h-2 w-2">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-[#3f6b52]/40" />
              <span className="relative inline-flex h-2 w-2 rounded-full bg-[#3f6b52]" />
            </span>
            Sincronizado en vivo
          </span>
        </div>

        {loading && items.length === 0 ? (
          <div className="space-y-3 p-5">
            {[0, 1, 2, 3, 4].map((row) => (
              <div key={row} className="h-11 animate-pulse rounded bg-[#25342e]/5" />
            ))}
          </div>
        ) : sorted.length === 0 ? (
          <div className="p-4">
            <EmptyState
              icon="table"
              title={hasFilters ? 'No hay registros que coincidan' : 'Todavía no hay registros'}
              description={
                hasFilters
                  ? 'Ajusta la búsqueda o los filtros para encontrar lo que necesitas.'
                  : 'Cuando alguien envíe un formulario desde el sitio, aparecerá aquí automáticamente. También puedes crear un registro manualmente.'
              }
              action={
                hasFilters ? (
                  <AdminButton variant="outline" onClick={clearFilters}>
                    Limpiar filtros
                  </AdminButton>
                ) : (
                  <AdminButton icon="plus" onClick={openCreate}>
                    Nuevo registro
                  </AdminButton>
                )
              }
            />
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full min-w-[1020px] text-left text-sm">
              <thead className="border-b border-[#25342e]/10 bg-[#faf7ea] text-[#5f6d66]">
                <tr>
                  {SORT_COLUMNS.map((column) => (
                    <SortHeader
                      key={column.key}
                      column={column.key}
                      label={column.label}
                      sort={sort}
                      onSort={handleSort}
                    />
                  ))}
                  <th className="px-4 py-3 text-[0.58rem] font-medium uppercase tracking-[0.16em] whitespace-nowrap">
                    Origen
                  </th>
                  <th className="px-4 py-3 text-[0.58rem] font-medium uppercase tracking-[0.16em] whitespace-nowrap">
                    ID
                  </th>
                  <th className="px-4 py-3 text-right text-[0.58rem] font-medium uppercase tracking-[0.16em]">
                    Acciones
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#25342e]/8">
                {pageItems.map((record) => {
                  const parts = dateParts(record.fecha ?? record.fechaCreacion)
                  return (
                    <tr key={record.id} className="transition hover:bg-[#faf7ea]/60">
                      <td className="px-4 py-3">
                        <button
                          type="button"
                          onClick={() => setDetailId(record.id)}
                          className="block max-w-[13rem] truncate text-left font-medium text-[#25342e] hover:underline"
                        >
                          {record.nombre || 'Sin nombre'}
                        </button>
                      </td>
                      <td className="px-4 py-3">
                        <a
                          href={`mailto:${record.email}`}
                          className="block max-w-[15rem] truncate text-xs text-[#55645d] hover:text-[#25342e]"
                        >
                          {record.email || '—'}
                        </a>
                      </td>
                      <td className="px-4 py-3">
                        <p className="max-w-[13rem] truncate text-xs text-[#3d453e]">
                          {record.asunto || 'Sin asunto'}
                        </p>
                        <p className="mt-0.5 max-w-[13rem] truncate text-[0.65rem] text-[#7d8a82]">
                          {record.mensaje}
                        </p>
                      </td>
                      <td className="px-4 py-3">
                        <StatusBadge estado={record.estado} />
                      </td>
                      <td className="px-4 py-3 whitespace-nowrap">
                        <p className="text-xs text-[#25342e]">{parts.date}</p>
                        <p className="font-mono text-[0.58rem] text-[#7d8a82]">{parts.time}</p>
                      </td>
                      <td className="px-4 py-3 text-[0.65rem] whitespace-nowrap text-[#55645d]">
                        {ORIGIN_LABEL[record.origen] || record.origen || 'Sitio web'}
                      </td>
                      <td className="px-4 py-3">
                        <button
                          type="button"
                          onClick={() => copyId(record.id)}
                          title={`Copiar ID: ${record.id}`}
                          className="font-mono text-[0.6rem] text-[#7d8a82] transition hover:text-[#25342e]"
                        >
                          {record.id.slice(0, 8)}…
                        </button>
                      </td>
                      <td className="px-4 py-3">
                        <div className="flex items-center justify-end gap-1.5">
                          <IconButton
                            icon="eye"
                            label="Ver detalle"
                            onClick={() => setDetailId(record.id)}
                          />
                          <IconButton
                            icon="pencil"
                            label="Editar registro"
                            onClick={() => openEdit(record)}
                          />
                          <IconButton
                            icon="trash"
                            label="Eliminar registro"
                            tone="danger"
                            onClick={() => setPendingDelete(record)}
                          />
                        </div>
                      </td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          </div>
        )}

        {sorted.length > 0 && (
          <div className="flex flex-wrap items-center justify-between gap-3 border-t border-[#25342e]/10 px-4 py-3">
            <p className="font-mono text-[0.55rem] uppercase tracking-[0.14em] text-[#7d8a82]">
              Página {currentPage} de {totalPages}
            </p>
            <div className="flex items-center gap-1.5">
              <button
                type="button"
                onClick={() => setPage(currentPage - 1)}
                disabled={currentPage === 1}
                aria-label="Página anterior"
                className="grid h-8 w-8 place-items-center rounded-full border border-[#25342e]/15 text-[#44544d] transition hover:border-[#25342e]/40 disabled:cursor-not-allowed disabled:opacity-40"
              >
                <Icon name="chevron-left" size={14} />
              </button>

              {pageNumbers.map((number) => (
                <button
                  key={number}
                  type="button"
                  onClick={() => setPage(number)}
                  aria-current={number === currentPage ? 'page' : undefined}
                  className={`h-8 min-w-8 rounded-full px-2 font-mono text-[0.6rem] transition ${
                    number === currentPage
                      ? 'bg-[#1f2a26] text-[#f4efdf]'
                      : 'border border-[#25342e]/15 text-[#55645d] hover:border-[#25342e]/40'
                  }`}
                >
                  {number}
                </button>
              ))}

              <button
                type="button"
                onClick={() => setPage(currentPage + 1)}
                disabled={currentPage === totalPages}
                aria-label="Página siguiente"
                className="grid h-8 w-8 place-items-center rounded-full border border-[#25342e]/15 text-[#44544d] transition hover:border-[#25342e]/40 disabled:cursor-not-allowed disabled:opacity-40"
              >
                <Icon name="chevron-right" size={14} />
              </button>
            </div>
          </div>
        )}
      </AdminCard>

      <Modal
        open={Boolean(detail)}
        title={detail?.asunto || 'Detalle del registro'}
        description={detail ? `${detail.nombre} · ${detail.email}` : ''}
        onClose={() => setDetailId(null)}
        size="lg"
        footer={
          detail ? (
            <>
              <button
                type="button"
                onClick={() => setPendingDelete(detail)}
                className="inline-flex items-center gap-2 rounded-full px-4 py-2.5 text-[0.62rem] font-medium uppercase tracking-[0.14em] text-[#9b4a32] transition hover:bg-[#9b4a32]/5"
              >
                <Icon name="trash" size={13} />
                Eliminar
              </button>
              <div className="flex-1" />
              <AdminButton variant="outline" onClick={() => setDetailId(null)}>
                Cerrar
              </AdminButton>
              <AdminButton icon="pencil" onClick={() => openEdit(detail)}>
                Editar registro
              </AdminButton>
            </>
          ) : null
        }
      >
        {detail && (
          <div className="space-y-6">
            <div className="flex flex-wrap items-center gap-3 border-b border-[#25342e]/10 pb-5">
              <StatusBadge estado={detail.estado} />
              <span className="rounded-full bg-[#25342e]/5 px-2.5 py-1 font-mono text-[0.55rem] uppercase tracking-[0.1em] text-[#55645d]">
                {ORIGIN_LABEL[detail.origen] || detail.origen || 'Sitio web'}
              </span>
              <span className="font-mono text-[0.55rem] text-[#7d8a82]">
                Creado: {formatDateTime(detail.fechaCreacion ?? detail.fecha)}
              </span>
              <span className="font-mono text-[0.55rem] text-[#7d8a82]">
                Actualizado: {formatDateTime(detail.fechaActualizacion)}
              </span>
            </div>

            <div className="grid gap-5 sm:grid-cols-2">
              <div className="sm:col-span-2">
                <Detail label="ID del documento (Firestore)" mono>
                  <span className="inline-flex flex-wrap items-center gap-2">
                    {detail.id}
                    <button
                      type="button"
                      onClick={() => copyId(detail.id)}
                      className="inline-flex items-center gap-1 rounded-full border border-[#25342e]/15 px-2 py-1 text-[0.55rem] font-medium uppercase tracking-[0.12em] text-[#55645d] transition hover:border-[#25342e]/40 hover:text-[#25342e]"
                    >
                      <Icon name="copy" size={11} />
                      Copiar
                    </button>
                  </span>
                </Detail>
              </div>

              <Detail label="Nombre">{detail.nombre || '—'}</Detail>
              <Detail label="Correo electrónico">
                <a href={`mailto:${detail.email}`} className="hover:underline">
                  {detail.email || '—'}
                </a>
              </Detail>
              <Detail label="Teléfono">{detail.telefono || 'No indicado'}</Detail>
              <Detail label="Asunto">{detail.asunto || 'Sin asunto'}</Detail>
              <Detail label="Fecha del formulario">{formatDateTime(detail.fecha)}</Detail>
              <Detail label="Estado">{STATUS_LABEL[detail.estado] || detail.estado}</Detail>
            </div>

            <div>
              <p className="font-mono text-[0.54rem] uppercase tracking-[0.16em] text-[#7d8a82]">
                Mensaje
              </p>
              <p className="mt-2 border border-[#25342e]/10 bg-white p-4 text-sm leading-relaxed whitespace-pre-line text-[#3d453e]">
                {detail.mensaje}
              </p>
            </div>

            <a
              href={`mailto:${detail.email}?subject=Respuesta%20a%20tu%20mensaje`}
              className="inline-flex items-center gap-2 border-b border-[#25342e]/25 pb-1 text-xs text-[#25342e] transition hover:border-[#25342e]"
            >
              <Icon name="mail" size={14} />
              Responder por correo
            </a>
          </div>
        )}
      </Modal>

      <Modal
        open={Boolean(editor)}
        title={editor?.mode === 'edit' ? 'Editar registro' : 'Nuevo registro'}
        description="Los cambios se guardan directamente en Cloud Firestore y se reflejan en el resto del sitio."
        onClose={() => {
          if (!saving) setEditor(null)
        }}
        footer={
          <>
            <AdminButton
              variant="outline"
              onClick={() => setEditor(null)}
              disabled={saving}
            >
              Cancelar
            </AdminButton>
            <button
              type="submit"
              form="record-form"
              disabled={saving}
              className="inline-flex items-center gap-2 rounded-full bg-[#1f2a26] px-5 py-2.5 text-[0.65rem] font-medium uppercase tracking-[0.16em] text-[#f4efdf] transition disabled:opacity-50"
            >
              {saving ? 'Guardando…' : editor?.mode === 'edit' ? 'Guardar cambios' : 'Crear registro'}
            </button>
          </>
        }
      >
        <form id="record-form" onSubmit={handleSubmit} noValidate className="grid gap-5 sm:grid-cols-2">
          <Field label="Nombre completo" htmlFor="record-nombre" error={errors.nombre} required>
            <TextInput
              id="record-nombre"
              value={form.nombre}
              onChange={updateField('nombre')}
              autoComplete="name"
              aria-invalid={Boolean(errors.nombre)}
            />
          </Field>

          <Field label="Correo electrónico" htmlFor="record-email" error={errors.email} required>
            <TextInput
              id="record-email"
              type="email"
              value={form.email}
              onChange={updateField('email')}
              autoComplete="email"
              aria-invalid={Boolean(errors.email)}
            />
          </Field>

          <Field label="Teléfono" htmlFor="record-telefono" error={errors.telefono}>
            <TextInput
              id="record-telefono"
              value={form.telefono}
              onChange={updateField('telefono')}
              autoComplete="tel"
            />
          </Field>

          <Field label="Asunto" htmlFor="record-asunto" error={errors.asunto}>
            <TextInput
              id="record-asunto"
              value={form.asunto}
              onChange={updateField('asunto')}
              placeholder="Información general"
            />
          </Field>

          <Field label="Estado" htmlFor="record-estado" error={errors.estado}>
            <Select id="record-estado" value={form.estado} onChange={updateField('estado')}>
              {STATUS_OPTIONS.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </Select>
          </Field>

          <Field
            label="Mensaje"
            htmlFor="record-mensaje"
            error={errors.mensaje}
            hint={`${form.mensaje.length}/3000 caracteres · mínimo 10`}
            required
            className="sm:col-span-2"
          >
            <TextArea
              id="record-mensaje"
              rows={6}
              value={form.mensaje}
              onChange={updateField('mensaje')}
              aria-invalid={Boolean(errors.mensaje)}
            />
          </Field>

          <p className="text-[0.68rem] leading-relaxed text-[#7d8a82] sm:col-span-2">
            <Icon name="lock" size={11} className="mr-1 inline" />
            Solo el administrador puede crear, editar o eliminar registros. Las reglas de Firestore
            validan cada escritura en el servidor.
          </p>
        </form>
      </Modal>

      <ConfirmDialog
        open={Boolean(pendingDelete)}
        title="¿Eliminar este registro?"
        description={`Se eliminará de Firestore el registro de “${pendingDelete?.nombre || 'este formulario'}”. La acción no se puede deshacer.`}
        loading={deleting}
        onConfirm={handleDelete}
        onCancel={() => setPendingDelete(null)}
      />
    </div>
  )
}
