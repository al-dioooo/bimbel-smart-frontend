import useSWR from 'swr'

import { fetcher } from '@/lib/fetcher'
import type { Absensi } from '@/lib/types'

/** AbsensiController::index returns a flat collection (paginate defaults to off). */
export function useAbsensi(params: Record<string, unknown>, enabled = true) {
    const key = enabled ? (['/absensi', params] as const) : null
    const { data, error, mutate, isLoading } = useSWR<Absensi[]>(
        key,
        ([url, p]: readonly [string, Record<string, unknown>]) => fetcher<Absensi[]>(url, p)
    )
    return { data, error, mutate, isLoading }
}
