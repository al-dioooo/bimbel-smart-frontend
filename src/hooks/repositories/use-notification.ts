import useSWR from 'swr'
import { fetcher } from '@/lib/fetcher'
import { Notification } from '@/lib/types'

export function useNotification(id: number | null) {
    const { data, isLoading, error, mutate } = useSWR<Notification[]>(id ? `/notification?user_id=${id}` : null, fetcher)
    return { data, isLoading, error, mutate }
}