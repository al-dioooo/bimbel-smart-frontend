/**
 * Single source of truth for the app's status colours.
 *
 * Previously the same four attendance states were coloured three different
 * ways (sky/rose/amber in absensi-card, raw hex in barChart, emerald/amber/red
 * in pengajuanDashboard). Everything now reads from here.
 */

export type StatusTone = 'success' | 'warning' | 'danger' | 'info' | 'neutral'

/** Tailwind classes per tone, for pills and badges. */
export const toneClasses: Record<StatusTone, string> = {
    success: 'bg-emerald-100 text-emerald-600 border-emerald-200',
    warning: 'bg-amber-100 text-amber-600 border-amber-200',
    danger: 'bg-red-100 text-red-600 border-red-200',
    info: 'bg-sky-100 text-sky-600 border-sky-200',
    neutral: 'bg-neutral-100 text-neutral-600 border-neutral-200',
}

/** Solid hex per tone, for chart fills (recharts cannot read Tailwind classes). */
export const toneHex: Record<StatusTone, string> = {
    success: '#10b981',
    warning: '#f59e0b',
    danger: '#ef4444',
    info: '#0ea5e9',
    neutral: '#a3a3a3',
}

/* -------------------------------------------------------------------------
 * Attendance — the API stores a lowercase char: h / s / i / a
 * ---------------------------------------------------------------------- */

export type AttendanceCode = 'h' | 's' | 'i' | 'a'

export const attendance: Record<AttendanceCode, { label: string; short: string; tone: StatusTone }> = {
    h: { label: 'Hadir', short: 'H', tone: 'info' },
    s: { label: 'Sakit', short: 'S', tone: 'warning' },
    i: { label: 'Izin', short: 'I', tone: 'neutral' },
    a: { label: 'Alpa', short: 'A', tone: 'danger' },
}

export const attendanceCodes = Object.keys(attendance) as AttendanceCode[]

/** Accepts `H` or `h`; returns null for an unset cell. */
export function normalizeAttendance(value?: string | null): AttendanceCode | null {
    if (!value) return null
    const code = value.toLowerCase()
    return (attendanceCodes as string[]).includes(code) ? (code as AttendanceCode) : null
}

/* -------------------------------------------------------------------------
 * Pengajuan jadwal — the DB column is `status` with pending|diterima|ditolak
 * ---------------------------------------------------------------------- */

export type PengajuanStatus = 'pending' | 'diterima' | 'ditolak'

export const pengajuanStatus: Record<PengajuanStatus, { label: string; tone: StatusTone }> = {
    pending: { label: 'Menunggu', tone: 'warning' },
    diterima: { label: 'Disetujui', tone: 'success' },
    ditolak: { label: 'Ditolak', tone: 'danger' },
}

export function normalizePengajuanStatus(value?: string | null): PengajuanStatus {
    const status = (value ?? '').toLowerCase()
    return status === 'diterima' || status === 'ditolak' ? status : 'pending'
}
