'use client'

import Link from "next/link"
import { usePathname } from "next/navigation"

import { cn } from "@/lib/utils"

type Props = {
    type?: "main" | "sublink"
    label: string
    href: string
    icon?: React.ReactNode
    activePath: string
    exact?: boolean
}

const normalize = (path: string) => (path === '/' ? '/' : path.replace(/\/+$/, ''))

export default function SidebarLink({ type = "main", label, href, icon, activePath, exact = false }: Props) {
    const pathname = usePathname()

    // Derived from the pathname rather than mirrored into state, so the active
    // item is correct on the very first render instead of after an effect.
    const isActive = exact
        ? normalize(pathname) === normalize(activePath)
        : normalize(pathname) === normalize(activePath) ||
          normalize(pathname).startsWith(`${normalize(activePath)}/`)

    return (
        <Link
            href={href}
            aria-current={isActive ? 'page' : undefined}
            className={cn(
                // Fills the rail instead of stopping at a hardcoded pr-12.
                'flex items-center w-full rounded-xl transition group',
                type === 'main' ? 'gap-3 p-1.5' : 'gap-4 pl-4 pr-3 py-2',
                type === 'main' && isActive
                    ? 'bg-radial-[at_0%_0%] from-sky-200 to-sky-50'
                    : 'hover:bg-neutral-100'
            )}
        >
            {icon && type === 'main' && (
                <span
                    className={cn(
                        'transition bg-radial-[at_20%_20%] p-2 rounded-lg shrink-0',
                        isActive ? 'from-sky-500 to-sky-300 text-white' : 'from-neutral-200 to-neutral-200 text-neutral-600'
                    )}
                >
                    {icon}
                </span>
            )}

            {type === 'sublink' && (
                <span
                    className={cn(
                        'w-2 h-2 shrink-0 rounded-full border transition',
                        isActive ? 'bg-sky-500 border-sky-500' : 'bg-transparent border-neutral-300'
                    )}
                />
            )}

            <span className={cn('text-sm truncate', isActive ? 'font-semibold text-sky-600' : 'text-neutral-500 font-medium')}>
                {label}
            </span>
        </Link>
    )
}
