import moment from 'moment'
import 'moment/locale/id'

moment.locale('id')

/** `12 Maret 2025` — the portal's canonical date format. */
export function formatDate(value?: string | Date | null, fallback = '-') {
    if (!value) return fallback
    const parsed = moment(value)
    return parsed.isValid() ? parsed.format('D MMMM YYYY') : fallback
}

/** `12 Mar 2025` — for tight columns. */
export function formatDateShort(value?: string | Date | null, fallback = '-') {
    if (!value) return fallback
    const parsed = moment(value)
    return parsed.isValid() ? parsed.format('D MMM YYYY') : fallback
}

/** `09:05` — zero-padded. `format('H:m')` renders `9:5`. */
export function formatTime(value?: string | null, fallback = '-') {
    if (!value) return fallback
    const parsed = moment(value, ['HH:mm:ss', 'HH:mm'])
    return parsed.isValid() ? parsed.format('HH:mm') : fallback
}

/** `09:05 - 11:00` */
export function formatTimeRange(start?: string | null, end?: string | null, fallback = '-') {
    if (!start && !end) return fallback
    return `${formatTime(start, '--:--')} - ${formatTime(end, '--:--')}`
}

const rupiah = new Intl.NumberFormat('id-ID', {
    style: 'currency',
    currency: 'IDR',
    maximumFractionDigits: 0,
})

/** `Rp480.000` */
export function formatCurrency(value?: number | string | null, fallback = '-') {
    if (value === null || value === undefined || value === '') return fallback
    const numeric = typeof value === 'string' ? Number(value) : value
    return Number.isFinite(numeric) ? rupiah.format(numeric as number) : fallback
}

/** `1.234` */
export function formatNumber(value?: number | null, fallback = '-') {
    if (value === null || value === undefined) return fallback
    return new Intl.NumberFormat('id-ID').format(value)
}

const MONTHS = [
    'Januari', 'Februari', 'Maret', 'April', 'Mei', 'Juni',
    'Juli', 'Agustus', 'September', 'Oktober', 'November', 'Desember',
]

/** `Maret 2025` from the 1-indexed month + year the report endpoints return. */
export function monthLabel(month?: number | null, year?: number | null, fallback = '-') {
    if (!month || month < 1 || month > 12) return fallback
    return year ? `${MONTHS[month - 1]} ${year}` : MONTHS[month - 1]
}

export { MONTHS }
