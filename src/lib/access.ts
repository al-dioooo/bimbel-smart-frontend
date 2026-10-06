import type { User } from '@/lib/types'

/** Mirrors users.role: 0 = Mentor, 1 = Administrator. */
export const ROLE = { MENTOR: 0, ADMIN: 1 } as const

export const isAdmin = (user: User | null | undefined) => user?.role === ROLE.ADMIN

/**
 * Pages a mentor may open. Anything not listed is admin-only, so a new page
 * stays hidden from mentors until it is added here on purpose.
 */
const MENTOR_ROUTES: RegExp[] = [
    /^\/$/,
    /^\/edit-profil$/,
    /^\/absensi$/,
    /^\/absensi\/rekap$/, // redirects to /report/absensi
    /^\/jadwal$/,
    /^\/jadwal\/list$/,
    /^\/jadwal\/pengajuan$/,
    /^\/jadwal\/pengajuan\/create$/,
    /^\/report\/absensi(\/\d+)?$/,
]

const GAJI_DETAIL = /^\/report\/gaji\/(\d+)$/

const normalize = (path: string) => (path === '/' ? '/' : path.replace(/\/+$/, ''))

export function canAccess(user: User, pathname: string): boolean {
    if (isAdmin(user)) return true

    const path = normalize(pathname)

    // A mentor may only open their own salary slip.
    const gaji = path.match(GAJI_DETAIL)
    if (gaji) return !!user.mentor && Number(gaji[1]) === user.mentor.id

    return MENTOR_ROUTES.some((route) => route.test(path))
}

/**
 * Query params that narrow API lists to the mentor's own classes; empty for
 * admins. A mentor without a profile gets an id that matches nothing rather
 * than an empty filter that would match everything.
 */
export function mentorScope(user: User | null | undefined): { mentor_id?: number } {
    if (!user || isAdmin(user)) return {}
    return { mentor_id: user.mentor?.id ?? -1 }
}
