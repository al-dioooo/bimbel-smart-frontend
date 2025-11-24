import useSWR from 'swr'
import { fetcher } from '@/lib/fetcher'
import { Jadwal, PaginatedResponse } from '@/lib/types'

export function useJadwal(params: Record<string, unknown>) {
    const key: [string, Record<string, unknown>] = ['/jadwal', params]
    const { data, error, mutate, isLoading, isValidating } = useSWR<PaginatedResponse<Jadwal>>(
        key,
        ([url, params]: [string, Record<string, unknown>]) => fetcher<PaginatedResponse<Jadwal>>(url, params)
    )
    return { data, error, mutate, isLoading, isValidating }
}

export function useJadwalById(id: number | null) {
    const { data, isLoading, error, mutate } = useSWR<Jadwal>(id ? `/jadwal/${id}` : null, fetcher)
    return { data, isLoading, error, mutate }
}