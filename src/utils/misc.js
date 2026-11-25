/** Une clases condicionales. */
export function cx(...values) {
  return values.filter(Boolean).join(' ')
}

export function slugify(value = '') {
  return value
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
}

export function initials(value = '') {
  return value
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((word) => word[0]?.toUpperCase() ?? '')
    .join('')
}

export function isEmail(value = '') {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value.trim())
}

export function truncate(value = '', length = 150) {
  if (value.length <= length) return value
  return `${value.slice(0, length).trimEnd()}…`
}

export function formatNumber(value) {
  return new Intl.NumberFormat('es-GT').format(value)
}
