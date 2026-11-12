'use client'

import { createContext, useContext, useEffect, useState } from 'react'
import { usePathname } from 'next/navigation'

type SidebarState = { open: boolean; setOpen: (open: boolean) => void }

const SidebarContext = createContext<SidebarState>({ open: false, setOpen: () => {} })

/**
 * Below the lg breakpoint the sidebar is a drawer (N4). This holds whether
 * it is open; it closes on navigation and on Escape.
 */
export function SidebarProvider({ children }: { children: React.ReactNode }) {
    const [open, setOpen] = useState(false)
    const pathname = usePathname()

    // A link inside the drawer navigates; the drawer should not stay over the new page.
    const [lastPath, setLastPath] = useState(pathname)
    if (lastPath !== pathname) {
        setLastPath(pathname)
        setOpen(false)
    }

    useEffect(() => {
        if (!open) return
        const onKey = (e: KeyboardEvent) => e.key === 'Escape' && setOpen(false)
        window.addEventListener('keydown', onKey)
        return () => window.removeEventListener('keydown', onKey)
    }, [open])

    return <SidebarContext.Provider value={{ open, setOpen }}>{children}</SidebarContext.Provider>
}

export const useSidebar = () => useContext(SidebarContext)
