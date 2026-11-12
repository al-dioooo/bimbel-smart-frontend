import useSWR from 'swr'

import api from '@/lib/axios'
import { fetcher } from '@/lib/fetcher'
import type {
    PaginatedResponse,
    ReportAbsensiRow,
    ReportAbsensiDetail,
    ReportGajiRow,
    ReportGajiDetailRow,
    PenyesuaianGaji,
} from '@/lib/types'

export function useReportAbsensi(params: Record<string, unknown>) {
    const key: [string, Record<string, unknown>] = ['/report/absensi', params]
    const { data, error, mutate, isLoading, isValidating } = useSWR<PaginatedResponse<ReportAbsensiRow>>(
        key,
        ([url, p]: [string, Record<string, unknown>]) => fetcher<PaginatedResponse<ReportAbsensiRow>>(url, p)
    )
    return { data, error, mutate, isLoading, isValidating }
}

export function useReportAbsensiByKelas(kelasId: number | null, params: Record<string, unknown>) {
    const key = kelasId ? ([`/report/absensi/${kelasId}`, params] as const) : null
    const { data, error, mutate, isLoading } = useSWR<ReportAbsensiDetail>(
        key,
        ([url, p]: readonly [string, Record<string, unknown>]) => fetcher<ReportAbsensiDetail>(url, p)
    )
    return { data, error, mutate, isLoading }
}

export function useReportGaji(params: Record<string, unknown>) {
    const key: [string, Record<string, unknown>] = ['/report/gaji', params]
    const { data, error, mutate, isLoading, isValidating } = useSWR<PaginatedResponse<ReportGajiRow>>(
        key,
        ([url, p]: [string, Record<string, unknown>]) => fetcher<PaginatedResponse<ReportGajiRow>>(url, p)
    )
    return { data, error, mutate, isLoading, isValidating }
}

export type ReportGajiDetail = {
    rows: PaginatedResponse<ReportGajiDetailRow>
    /** REQ-064: the bonus/potongan of the same filter. */
    penyesuaian: PenyesuaianGaji[]
}

/** The per-kelas rows plus the adjustments, which sit beside `data` in the response. */
export function useReportGajiByMentor(mentorId: number | null, params: Record<string, unknown>) {
    const key = mentorId ? ([`/report/gaji/${mentorId}`, params] as const) : null
    const { data, error, mutate, isLoading } = useSWR<ReportGajiDetail>(
        key,
        ([url, p]: readonly [string, Record<string, unknown>]) =>
            api.get(url, { params: p }).then((r) => ({ rows: r.data.data, penyesuaian: r.data.penyesuaian ?? [] }))
    )
    return { data, error, mutate, isLoading }
}
