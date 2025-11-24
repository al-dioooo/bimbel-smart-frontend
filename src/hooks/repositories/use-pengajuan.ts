import useSWR from 'swr'
import { fetcher } from '@/lib/fetcher'
import { Pengajuan, PaginatedResponse } from '@/lib/types'

export function usePengajuan(params: Record<string, unknown>) {
    const key: [string, Record<string, unknown>] = ['/pengajuan', params]
    const { data, error, mutate, isLoading, isValidating } = useSWR<PaginatedResponse<Pengajuan>>(
        key,
        ([url, params]: [string, Record<string, unknown>]) => fetcher<PaginatedResponse<Pengajuan>>(url, params)
    )
    return { data, error, mutate, isLoading, isValidating }
}

export function usePengajuanById(id: number | null) {
    const { data, error, mutate } = useSWR<Pengajuan>(id ? `/pengajuan/${id}` : null, fetcher)
    return { data, loading: id ? !error && !data : false, error, mutate }
}