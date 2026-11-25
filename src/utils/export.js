import { toDate } from './dates'

const COLUMNS = [
  { key: 'id', label: 'ID' },
  { key: 'nombre', label: 'Nombre' },
  { key: 'email', label: 'Correo' },
  { key: 'telefono', label: 'Teléfono' },
  { key: 'asunto', label: 'Asunto' },
  { key: 'mensaje', label: 'Mensaje' },
  { key: 'estado', label: 'Estado' },
  { key: 'origen', label: 'Origen' },
  { key: 'fecha', label: 'Fecha de envío' },
  { key: 'fechaCreacion', label: 'Creado' },
  { key: 'fechaActualizacion', label: 'Última modificación' },
]

function formatValue(value, key) {
  if (['fecha', 'fechaCreacion', 'fechaActualizacion'].includes(key)) {
    const date = toDate(value)
    return date
      ? date.toLocaleString('es-GT', {
          day: '2-digit',
          month: '2-digit',
          year: 'numeric',
          hour: '2-digit',
          minute: '2-digit',
        })
      : ''
  }
  return value == null ? '' : String(value)
}

/** Convierte los registros visibles en filas con encabezados legibles. */
export function buildRows(items = []) {
  return items.map((item) =>
    Object.fromEntries(COLUMNS.map((column) => [column.label, formatValue(item[column.key], column.key)])),
  )
}

function stamp() {
  const now = new Date()
  const pad = (value) => String(value).padStart(2, '0')
  return `${now.getFullYear()}-${pad(now.getMonth() + 1)}-${pad(now.getDate())}_${pad(now.getHours())}${pad(now.getMinutes())}`
}

function download(blob, filename) {
  const url = URL.createObjectURL(blob)
  const link = document.createElement('a')
  link.href = url
  link.download = filename
  document.body.appendChild(link)
  link.click()
  link.remove()
  URL.revokeObjectURL(url)
}

/** CSV con BOM para que Excel respete las tildes. */
export function exportRecordsCsv(items) {
  const rows = buildRows(items)
  if (!rows.length) throw new Error('No hay registros para exportar.')
  const headers = COLUMNS.map((column) => column.label)
  const escape = (value) => `"${String(value).replace(/"/g, '""')}"`
  const lines = [
    headers.map(escape).join(';'),
    ...rows.map((row) => headers.map((header) => escape(row[header] ?? '')).join(';')),
  ]
  const blob = new Blob([`\uFEFF${lines.join('\r\n')}`], { type: 'text/csv;charset=utf-8;' })
  download(blob, `registros-${stamp()}.csv`)
}

/** XLSX real; la librería se carga solo al exportar. */
export async function exportRecordsXlsx(items) {
  const rows = buildRows(items)
  if (!rows.length) throw new Error('No hay registros para exportar.')
  const XLSX = await import('xlsx')
  const sheet = XLSX.utils.json_to_sheet(rows)
  sheet['!cols'] = COLUMNS.map((column) => ({
    wch: Math.min(48, Math.max(12, column.label.length + 4)),
  }))
  const book = XLSX.utils.book_new()
  XLSX.utils.book_append_sheet(book, sheet, 'Registros')
  XLSX.writeFile(book, `registros-${stamp()}.xlsx`)
}
