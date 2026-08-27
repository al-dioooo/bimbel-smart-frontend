'use client'

import { usePathname, useRouter, useSearchParams } from 'next/navigation'
import { useEffect, useRef, useState } from 'react'

export type SortDirection = 'asc' | 'desc'

/**
 * Owns the URL-backed list state (search / sort / filter / page) that every
 * list page needs. Previously this block was copy-pasted verbatim into eight
 * pages — including a dead `if (a !== b) { if (a !== b) { … } }` double-nest
 * and a debounce that fired on mount and pushed an empty `?search=`.
 */
export function useListParams(filterKeys: string[] = []) {
    const router = useRouter()
    const pathname = usePathname()
    const searchParams = useSearchParams()

    const search = searchParams.get('search')
    const page = searchParams.get('page')
    const orderBy = searchParams.get('order_by')
    const direction = (searchParams.get('direction') as SortDirection | null) ?? null

    const [searchTemp, setSearchTemp] = useState(search ?? '')

    // Keep the input in sync when the URL changes from elsewhere (e.g. Clear).
    const lastSearch = useRef(search)
    useEffect(() => {
        if (lastSearch.current !== search) {
            lastSearch.current = search
            setSearchTemp(search ?? '')
        }
    }, [search])

    // Debounced write-back. Skips the no-op case so it never fires on mount.
    useEffect(() => {
        const current = searchTemp.trim()
        if (current === (search ?? '')) return

        const timeout = setTimeout(() => {
            const params = new URLSearchParams(searchParams.toString())
            if (current === '') params.delete('search')
            else params.set('search', current)
            // A new query invalidates the current page offset.
            params.delete('page')
            lastSearch.current = current === '' ? null : current
            router.replace(params.size ? `${pathname}?${params}` : pathname)
        }, 400)

        return () => clearTimeout(timeout)
    }, [searchTemp, search, pathname, router, searchParams])

    const toggleSort = (value: string) => {
        const params = new URLSearchParams(searchParams.toString())
        const isSameColumn = params.get('order_by') === value
        const nextDirection = isSameColumn && params.get('direction') === 'asc' ? 'desc' : 'asc'

        params.set('order_by', value)
        params.set('direction', nextDirection)
        router.replace(`${pathname}?${params}`)
    }

    const updateFilter = (values: Record<string, string | null>) => {
        const params = new URLSearchParams(searchParams.toString())

        // Drop filter keys the modal no longer reports, so removing one field
        // in the UI actually removes it from the URL.
        filterKeys.forEach((key) => params.delete(key))

        Object.entries(values).forEach(([key, value]) => {
            if (value === null || value === '') params.delete(key)
            else params.set(key, String(value))
        })

        params.delete('page')
        router.replace(params.size ? `${pathname}?${params}` : pathname)
    }

    const removeFilter = () => {
        const params = new URLSearchParams(searchParams.toString())
        filterKeys.forEach((key) => params.delete(key))
        params.delete('page')
        router.replace(params.size ? `${pathname}?${params}` : pathname)
    }

    /** Only the filter keys that are actually set — drives the toolbar badge. */
    const activeFilters = Object.fromEntries(
        filterKeys
            .map((key) => [key, searchParams.get(key)] as const)
            .filter(([, value]) => value !== null && value !== '')
    ) as Record<string, string>

    return {
        page,
        search,
        orderBy,
        direction,
        searchTemp,
        setSearchTemp,
        toggleSort,
        updateFilter,
        removeFilter,
        activeFilters,
    }
}
