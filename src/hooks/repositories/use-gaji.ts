import useSWR from 'swr'

import { fetcher } from '@/lib/fetcher'
import type { PeriodeGaji } from '@/lib/types'

/** UC-10 preview (draft) or final payroll of one month, `YYYY-MM`. */
export function usePeriodeGaji(bulan: string | null) {
    const { data, error, mutate, isLoading } = useSWR<PeriodeGaji>(
        bulan ? `/report/gaji/periode/${bulan}` : null,
        (url: string) => fetcher<PeriodeGaji>(url)
    )
    return { data, error, mutate, isLoading }
}
