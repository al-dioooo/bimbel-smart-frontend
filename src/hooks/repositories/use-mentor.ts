import useSWR from 'swr'
import { fetcher } from '@/lib/fetcher'
import { Mentor, PaginatedResponse } from '@/lib/types'

export function useMentor(params: Record<string, unknown>) {
    const key: [string, Record<string, unknown>] = ['/mentor', params]
    const { data, error, mutate, isLoading, isValidating } = useSWR<PaginatedResponse<Mentor>>(
        key,
        ([url, params]: [string, Record<string, unknown>]) => fetcher<PaginatedResponse<Mentor>>(url, params)
    )
    return { data, error, mutate, isLoading, isValidating }
}

export function useMentorById(id: number | null) {
    const { data, error, mutate } = useSWR<Mentor>(id ? `/mentor/${id}` : null, fetcher)
    return { data, loading: id ? !error && !data : false, error, mutate }
}