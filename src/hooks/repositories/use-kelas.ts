import useSWR from 'swr'
import { fetcher } from '@/lib/fetcher'
import { Kelas, PaginatedResponse } from '@/lib/types'

export function useKelas(params: Record<string, unknown>) {
    const key: [string, Record<string, unknown>] = ['/kelas', params]
    const { data, error, mutate, isLoading, isValidating } = useSWR<PaginatedResponse<Kelas>>(
        key,
        ([url, params]: [string, Record<string, unknown>]) => fetcher<PaginatedResponse<Kelas>>(url, params)
    )
    return { data, error, mutate, isLoading, isValidating }
}

export function useKelasById(id: number | null) {
    const { data, isLoading, error, mutate } = useSWR<Kelas>(id ? `/kelas/${id}` : null, fetcher)
    return { data, isLoading, error, mutate }
}