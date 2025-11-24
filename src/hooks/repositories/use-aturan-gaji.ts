import useSWR from 'swr'
import { fetcher } from '@/lib/fetcher'
import { AturanGaji, PaginatedResponse } from '@/lib/types'

export function useAturanGaji(params: Record<string, unknown>) {
    const key: [string, Record<string, unknown>] = ['/aturan-gaji', params]
    const { data, error, mutate, isLoading, isValidating } = useSWR<PaginatedResponse<AturanGaji>>(
        key,
        ([url, params]: [string, Record<string, unknown>]) => fetcher<PaginatedResponse<AturanGaji>>(url, params)
    )
    return { data, error, mutate, isLoading, isValidating }
}

export function useAturanGajiById(id: number | null) {
    const { data, isLoading, error, mutate } = useSWR<AturanGaji>(id ? `/aturan-gaji/${id}` : null, fetcher)
    return { data, isLoading, error, mutate }
}