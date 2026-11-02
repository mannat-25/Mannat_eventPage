const MONTHS = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']

function parseDate(iso: string): Date | null {
  const [y, m, d] = iso.slice(0, 10).split('-').map(Number)
  if (!y || !m || !d) return null
  return new Date(Date.UTC(y, m - 1, d))
}

/** "2026-03-14" -> "14 Mar 2026". Timezone-safe so SSR and client agree. */
export function formatDate(iso: string): string {
  const date = parseDate(iso)
  if (!date) return iso
  return `${date.getUTCDate()} ${MONTHS[date.getUTCMonth()]} ${date.getUTCFullYear()}`
}

/** Split parts for oversized date numerals. */
export function dateParts(iso: string) {
  const date = parseDate(iso)
  if (!date) return { day: '--', month: '', year: '' }
  return {
    day: String(date.getUTCDate()).padStart(2, '0'),
    month: MONTHS[date.getUTCMonth()],
    year: String(date.getUTCFullYear()),
  }
}
