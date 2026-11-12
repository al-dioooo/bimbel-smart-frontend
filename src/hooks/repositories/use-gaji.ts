import useSWR from 'swr'

import { fetcher } from '@/lib/fetcher'
import type { PenyesuaianGaji, PeriodeGaji } from '@/lib/types'

/** UC-10 preview (draft) or final payroll of one month, `YYYY-MM`. */
export function usePeriodeGaji(bulan: string | null) {
    const { data, error, mutate, isLoading } = useSWR<PeriodeGaji>(
        bulan ? `/report/gaji/periode/${bulan}` : null,
        (url: string) => fetcher<PeriodeGaji>(url)
    )
    return { data, error, mutate, isLoading }
}

/** REQ-064: the bonus/potongan of one month, with each mentor. */
export function usePenyesuaianGaji(bulan: string | null) {
    const { data, error, mutate, isLoading } = useSWR<PenyesuaianGaji[]>(
        bulan ? ['/penyesuaian-gaji', { bulan, paginate: false }] : null,
        ([url, params]: [string, Record<string, unknown>]) => fetcher<PenyesuaianGaji[]>(url, params)
    )
    return { data, error, mutate, isLoading }
}
