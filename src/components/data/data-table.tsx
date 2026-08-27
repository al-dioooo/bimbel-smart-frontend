'use client'

import { AutoHeight } from '@/components/auto-height'
import { ChevronUpDown } from '@/components/icons/dynamic'
import { cn } from '@/lib/utils'
import type { SortDirection } from './use-list-params'

export type Column<T> = {
    /** Stable key for React. */
    key: string
    header: React.ReactNode
    /** The API column to sort by. Omit to render a static header. */
    sortKey?: string
    render: (row: T, index: number) => React.ReactNode
    /** Extra classes for the `<td>` — e.g. `text-right`. */
    cellClassName?: string
    headerClassName?: string
}

type Props<T> = {
    columns: Column<T>[]
    rows?: T[]
    rowKey: (row: T) => string | number

    isLoading?: boolean
    error?: unknown
    /** When set, the empty state says "no results" rather than "no data". */
    isFiltered?: boolean

    orderBy?: string | null
    direction?: SortDirection | null
    onSort?: (key: string) => void

    emptyMessage?: string
    filteredEmptyMessage?: string
    errorMessage?: string
}

function StateRow({ colSpan, children, tone = 'neutral' }: {
    colSpan: number
    children: React.ReactNode
    tone?: 'neutral' | 'danger'
}) {
    return (
        <tr>
            <td
                colSpan={colSpan}
                className={cn(
                    'px-6 py-4 text-xs whitespace-nowrap',
                    tone === 'danger' ? 'text-red-500' : 'text-neutral-500'
                )}
            >
                <div className="flex items-center gap-4">
                    <hr className="grow border-current/30" />
                    <span>{children}</span>
                    <hr className="grow border-current/30" />
                </div>
            </td>
        </tr>
    )
}

/**
 * Table shell + sortable headers + the four body states, in one place.
 * Each of the eight list pages used to carry its own copy of all of it.
 */
export default function DataTable<T>({
    columns,
    rows,
    rowKey,
    isLoading = false,
    error,
    isFiltered = false,
    orderBy,
    direction,
    onSort,
    emptyMessage = 'Belum ada data',
    filteredEmptyMessage = 'Tidak ada hasil yang cocok',
    errorMessage = 'Gagal memuat data',
}: Props<T>) {
    const colSpan = columns.length
    const hasRows = !!rows && rows.length > 0

    return (
        <div className="overflow-x-auto border border-neutral-200 rounded-xl bg-white">
            <AutoHeight>
                <table className="min-w-full divide-y divide-neutral-200">
                    <thead className="bg-neutral-50">
                        <tr>
                            {columns.map((column) => {
                                const isSorted = !!column.sortKey && orderBy === column.sortKey
                                const headerClasses = cn(
                                    'px-6 py-3 text-xs font-medium text-left uppercase text-neutral-500 whitespace-nowrap',
                                    column.headerClassName
                                )

                                if (!column.sortKey || !onSort) {
                                    return (
                                        <th key={column.key} scope="col" className={headerClasses}>
                                            {column.header}
                                        </th>
                                    )
                                }

                                return (
                                    <th
                                        key={column.key}
                                        scope="col"
                                        className={headerClasses}
                                        aria-sort={isSorted ? (direction === 'asc' ? 'ascending' : 'descending') : 'none'}
                                    >
                                        <button
                                            type="button"
                                            onClick={() => onSort(column.sortKey!)}
                                            className={cn(
                                                'flex cursor-pointer items-center gap-1 uppercase transition-colors hover:text-neutral-800',
                                                isSorted && 'text-sky-600'
                                            )}
                                        >
                                            <span>{column.header}</span>
                                            <ChevronUpDown
                                                direction={isSorted ? (direction === 'asc' ? 'up' : 'down') : false}
                                                className="w-4 h-4"
                                                strokeWidth={2}
                                            />
                                        </button>
                                    </th>
                                )
                            })}
                        </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-neutral-200">
                        {isLoading && <StateRow colSpan={colSpan}>Memuat data…</StateRow>}

                        {!isLoading && !!error && (
                            <StateRow colSpan={colSpan} tone="danger">{errorMessage}</StateRow>
                        )}

                        {!isLoading && !error && !hasRows && (
                            <StateRow colSpan={colSpan}>
                                {isFiltered ? filteredEmptyMessage : emptyMessage}
                            </StateRow>
                        )}

                        {!isLoading && !error && hasRows && rows!.map((row, index) => (
                            <tr key={rowKey(row)} className="hover:bg-neutral-50 transition-colors">
                                {columns.map((column) => (
                                    <td
                                        key={column.key}
                                        className={cn(
                                            'px-6 py-4 text-xs text-neutral-500 whitespace-nowrap',
                                            column.cellClassName
                                        )}
                                    >
                                        {column.render(row, index)}
                                    </td>
                                ))}
                            </tr>
                        ))}
                    </tbody>
                </table>
            </AutoHeight>
        </div>
    )
}
