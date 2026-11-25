import { Timestamp } from 'firebase/firestore'

const MONTHS = [
  'enero',
  'febrero',
  'marzo',
  'abril',
  'mayo',
  'junio',
  'julio',
  'agosto',
  'septiembre',
  'octubre',
  'noviembre',
  'diciembre',
]

const WEEKDAYS = [
  'domingo',
  'lunes',
  'martes',
  'miércoles',
  'jueves',
  'viernes',
  'sábado',
]

/** Acepta Timestamp de Firestore, Date, string ISO o número. */
export function toDate(value) {
  if (!value) return null
  if (value instanceof Date) return value
  if (typeof value?.toDate === 'function') return value.toDate()
  const parsed = new Date(value)
  return Number.isNaN(parsed.getTime()) ? null : parsed
}

export function toTimestamp(value) {
  const date = toDate(value)
  return date ? Timestamp.fromDate(date) : null
}

export function isUpcoming(value) {
  const date = toDate(value)
  if (!date) return false
  const today = new Date()
  today.setHours(0, 0, 0, 0)
  return date >= today
}

export function startOfToday() {
  const date = new Date()
  date.setHours(0, 0, 0, 0)
  return date
}

export function monthShort(value) {
  const date = toDate(value)
  return date ? MONTHS[date.getMonth()].slice(0, 3).toUpperCase() : ''
}

export function monthLong(value) {
  const date = toDate(value)
  return date ? MONTHS[date.getMonth()] : ''
}

export function dayNumber(value) {
  const date = toDate(value)
  return date ? String(date.getDate()).padStart(2, '0') : ''
}

export function yearOf(value) {
  const date = toDate(value)
  return date ? date.getFullYear() : ''
}

export function formatFullDate(value) {
  const date = toDate(value)
  if (!date) return ''
  return `${WEEKDAYS[date.getDay()]} ${date.getDate()} de ${MONTHS[date.getMonth()]} de ${date.getFullYear()}`
}

export function formatShortDate(value) {
  const date = toDate(value)
  if (!date) return ''
  return `${date.getDate()} ${MONTHS[date.getMonth()]} ${date.getFullYear()}`
}

export function formatMonthYear(value) {
  const date = toDate(value)
  if (!date) return ''
  return `${MONTHS[date.getMonth()]} ${date.getFullYear()}`
}

export function sortByDateAsc(items) {
  return [...items].sort((a, b) => (toDate(a.fecha)?.getTime() ?? 0) - (toDate(b.fecha)?.getTime() ?? 0))
}

export function toDateInput(value) {
  const date = toDate(value)
  if (!date) return ''
  return date.toISOString().slice(0, 10)
}
