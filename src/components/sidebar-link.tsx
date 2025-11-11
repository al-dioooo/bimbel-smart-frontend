'use client'

import Link from "next/link"
import { usePathname } from "next/navigation"
import { useEffect, useState } from "react"

type Props = {
    type: "main" | "sublink",
    label: string
    href: string
    icon?: React.ReactNode
    activePath: string
    exact?: boolean
}

export default function SidebarLink({ type = "main", label, href, icon, activePath, exact = false }: Props) {
    const pathname = usePathname()

    const [isActive, setIsActive] = useState(activePath === pathname)

    useEffect(() => {
        if (!exact) {
            const normalize = (p: string) => (p === '/' ? '/' : p.replace(/\/+$/, ''))
            const current = normalize(pathname)
            const target = normalize(activePath)
            const isActive = current === target || current.startsWith(`${target}/`)

            setIsActive(isActive)
        } else {
            setIsActive(activePath === pathname)
        }
    }, [pathname])

    return (
        <Link className={`${type === 'main' ? 'space-x-4' : 'space-x-6'} ${type === 'main' && isActive ? 'bg-radial-[at_0%_0%] from-sky-200 to-sky-50' : 'hover:bg-neutral-100'} ${type === "sublink" ? 'pl-4 py-2.5' : 'pl-1.5 py-1.5'} transition flex items-center group pr-12 rounded-2xl w-full`} href={href}>
            {(icon && type === "main") && <span className={`${isActive ? 'to-sky-300 from-sky-500 text-white' : 'from-neutral-200 to-neutral-200'} transition bg-radial-[at_20%_20%] p-2 rounded-xl`}>{icon}</span>}
            {(!icon && type === "sublink") && <div className={`${isActive ? 'bg-sky-500 border-sky-500' : 'bg-transparent border-neutral-200'} border transition p-2 rounded-full`}></div>}
            <span className={`${isActive ? 'font-semibold text-sky-500' : 'text-neutral-500 font-medium'} text-sm`}>{label}</span>
        </Link>
    )
}
