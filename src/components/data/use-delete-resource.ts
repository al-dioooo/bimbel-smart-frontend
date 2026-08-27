'use client'

import { useState } from 'react'
import { toast } from 'sonner'

import api from '@/lib/axios'

type Options = {
    /** e.g. `/kelas` — the id is appended. */
    endpoint: string
    /** Revalidate the list after a successful delete. */
    onDeleted?: () => void | Promise<unknown>
    successMessage?: string
    errorMessage?: string
}

/**
 * Delete flow shared by every list page: hold the pending row, confirm, call
 * the API, surface the outcome, revalidate.
 *
 * Previously MenuAction's delete item was `onClick={() => { }}` on all five
 * list pages, so nothing could be removed from the UI at all.
 */
export function useDeleteResource<T extends { id: number | string }>({
    endpoint,
    onDeleted,
    successMessage = 'Data berhasil dihapus',
    errorMessage = 'Gagal menghapus data',
}: Options) {
    const [target, setTarget] = useState<T | null>(null)

    const confirm = async () => {
        if (!target) return

        try {
            await api.delete(`${endpoint}/${target.id}`)
            toast.success(successMessage)
            await onDeleted?.()
        } catch (error: unknown) {
            const message =
                (error as { response?: { data?: { message?: string } } })?.response?.data?.message
            toast.error(message || errorMessage)
            throw error
        }
    }

    return {
        target,
        isOpen: target !== null,
        request: (row: T) => setTarget(row),
        cancel: () => setTarget(null),
        confirm,
    }
}
