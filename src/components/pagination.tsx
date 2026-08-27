'use client'

import Link from "next/link"

import { ArrowNarrowLeft, ArrowNarrowRight } from "@/components/icons/outline"
import { cn } from "@/lib/utils"

export type PaginationLink = {
    url: string | null
    label: string
    active: boolean
}

type Props = {
    links?: PaginationLink[]
    from?: number
    to?: number
    total?: number
    /**
     * Provide to paginate without navigating (used inside modals). The page
     * number is derived from the Laravel link label. Omit for URL navigation.
     */
    onNavigate?: (page: number) => void
    current?: number
}

const cellBase =
    "mb-1 mr-1 text-sm leading-4 border rounded-xl transition select-none"

/**
 * Single pagination component. There used to be two — `pagination` (links) and
 * `no-redirect-pagination` (callbacks) — which had drifted apart: neither
 * keyed its list correctly and their disabled arrows used different colours.
 */
export default function Pagination({ links, from, to, total, onNavigate, current }: Props) {
    if (!links || links.length <= 3) return null

    const lastIndex = links.length - 1

    const pageFromLabel = (row: PaginationLink, index: number) => {
        if (index === 0) return (current ?? 1) - 1
        if (index === lastIndex) return (current ?? 1) + 1
        const parsed = Number.parseInt(row.label, 10)
        return Number.isNaN(parsed) ? (current ?? 1) : parsed
    }

    return (
        <div className="flex items-center flex-wrap gap-4 justify-between w-full">
            <div className="flex flex-wrap -mb-1">
                {links.map((row, index) => {
                    const isArrow = index === 0 || index === lastIndex
                    const content = index === 0
                        ? <ArrowNarrowLeft className="w-5 h-5" />
                        : index === lastIndex
                            ? <ArrowNarrowRight className="w-5 h-5" />
                            : row.label

                    const padding = isArrow ? "px-4 py-2" : "px-4 py-3"

                    if (row.url === null) {
                        return (
                            <span
                                key={`${index}-${row.label}`}
                                aria-disabled="true"
                                className={cn(cellBase, padding, "inline-flex items-center text-neutral-300 border-neutral-200")}
                            >
                                {content}
                            </span>
                        )
                    }

                    const interactive = cn(
                        cellBase,
                        padding,
                        "inline-flex items-center cursor-pointer border-neutral-200 active:scale-95",
                        row.active
                            ? "bg-sky-500 text-white border-sky-500 hover:bg-sky-400"
                            : "text-neutral-700 hover:bg-sky-50 hover:border-sky-200"
                    )

                    if (onNavigate) {
                        return (
                            <button
                                key={`${index}-${row.label}`}
                                type="button"
                                onClick={() => onNavigate(pageFromLabel(row, index))}
                                className={interactive}
                            >
                                {content}
                            </button>
                        )
                    }

                    return (
                        <Link key={`${index}-${row.label}`} href={row.url} className={interactive}>
                            {content}
                        </Link>
                    )
                })}
            </div>

            {total !== undefined && (
                <p className="text-sm leading-5 text-neutral-600">
                    Menampilkan <span className="font-medium">{from ?? 0}</span>
                    {" – "}
                    <span className="font-medium">{to ?? 0}</span>
                    {" dari "}
                    <span className="font-medium">{total}</span> data
                </p>
            )}
        </div>
    )
}
