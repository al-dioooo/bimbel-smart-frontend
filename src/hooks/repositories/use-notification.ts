import useSWR from 'swr'
import { fetcher } from '@/lib/fetcher'
import { Notification } from '@/lib/types'

export function useNotification(userId: number | null) {
    const { data, isLoading, error, mutate } = useSWR<Notification[]>(
        userId ? ['/notification', { user_id: userId }] : null,
        ([url, params]: readonly [string, Record<string, unknown>]) => fetcher<Notification[]>(url, params)
    )
    return { data, isLoading, error, mutate }
}
