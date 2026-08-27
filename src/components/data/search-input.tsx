'use client'

import { Search } from '@/components/icons/outline'
import { cn } from '@/lib/utils'

type Props = {
    value: string
    onChange: (value: string) => void
    placeholder?: string
    className?: string
}

/**
 * The one search field. Eight pages each had their own copy, and `/absensi`
 * had a ninth at a different size. The icon wrapper here is anchored with
 * `left-0` — the originals relied on `absolute` with no inset, which only
 * happened to land in the right place.
 */
export default function SearchInput({
    value,
    onChange,
    placeholder = 'Cari data',
    className,
}: Props) {
    return (
        <div className={cn('relative w-full sm:w-64', className)}>
            <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                <Search className="w-4 h-4 text-neutral-400" />
            </div>
            <input
                type="text"
                value={value}
                onChange={(e) => onChange(e.target.value)}
                placeholder={placeholder}
                autoComplete="off"
                className="w-full py-2.5 pl-9 pr-4 text-xs transition border border-neutral-200 rounded-full placeholder-neutral-400 focus:outline-none focus:border-sky-400 focus:ring-2 focus:ring-sky-200"
            />
        </div>
    )
}
