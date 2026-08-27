import useSWR from 'swr'
import { fetcher } from '@/lib/fetcher'
import { PengajuanJadwal, PaginatedResponse } from '@/lib/types'

export function usePengajuanJadwal(params: Record<string, unknown>) {
    const key: [string, Record<string, unknown>] = ['/pengajuan-jadwal', params]
    const { data, error, mutate, isLoading, isValidating } = useSWR<PaginatedResponse<PengajuanJadwal>>(
        key,
        ([url, params]: [string, Record<string, unknown>]) => fetcher<PaginatedResponse<PengajuanJadwal>>(url, params)
    )
    return { data, error, mutate, isLoading, isValidating }
}

export function usePengajuanJadwalById(id: number | null) {
    const { data, error, mutate } = useSWR<PengajuanJadwal>(id ? `/pengajuan-jadwal/${id}` : null, fetcher)
    return { data, loading: id ? !error && !data : false, error, mutate }
}