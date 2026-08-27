import useSWR from 'swr'

import { fetcher } from '@/lib/fetcher'
import type { DashboardStats } from '@/lib/types'

export function useDashboardStats(params: Record<string, unknown> = {}) {
    const key: [string, Record<string, unknown>] = ['/dashboard/stats', params]
    const { data, error, mutate, isLoading } = useSWR<DashboardStats>(
        key,
        ([url, p]: [string, Record<string, unknown>]) => fetcher<DashboardStats>(url, p)
    )
    return { data, error, mutate, isLoading }
}
