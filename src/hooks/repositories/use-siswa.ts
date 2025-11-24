import useSWR from 'swr'
import { fetcher } from '@/lib/fetcher'
import { Siswa, PaginatedResponse } from '@/lib/types'

export function useSiswa(params: Record<string, unknown>) {
    const key: [string, Record<string, unknown>] = ['/siswa', params]
    const { data, error, mutate, isLoading, isValidating } = useSWR<PaginatedResponse<Siswa>>(
        key,
        ([url, params]: [string, Record<string, unknown>]) => fetcher<PaginatedResponse<Siswa>>(url, params)
    )
    return { data, error, mutate, isLoading, isValidating }
}

export function useSiswaById(id: number | null) {
    const { data, error, mutate } = useSWR<Siswa>(id ? `/siswa/${id}` : null, fetcher)
    return { data, loading: id ? !error && !data : false, error, mutate }
}