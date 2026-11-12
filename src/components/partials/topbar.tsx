'use client'

import { useRouter } from "next/navigation"

import GlobalSearch from "@/components/global-search"
import { ProgressiveBlur } from "@/components/progressive-blur"
import ProfileAction from "@/components/profile-action"
import Notifications from "@/components/notifications"
import { logout } from "@/helpers/auth"
import { useSidebar } from "@/components/partials/sidebar-state"
import { Menu } from "@/components/icons/outline"

export default function Topbar() {
    const router = useRouter()

    const handleLogout = async () => {
        try {
            await logout()
        } finally {
            router.replace("/login")
        }
    }

    const { open, setOpen } = useSidebar()

    return (
        <div className="px-4 sm:px-6 pb-4 pt-4 sm:pt-6 flex justify-between items-center sticky top-0 gap-2 sm:gap-4 z-10 rounded-t-xl">
            <ProgressiveBlur className="w-full -z-10 rounded-t-xl" height="150%" position="top" />

            {/* N4: below lg the sidebar is a drawer behind this button. */}
            <button
                type="button"
                onClick={() => setOpen(!open)}
                aria-label="Buka menu navigasi"
                aria-controls="sidebar"
                aria-expanded={open}
                className="shrink-0 rounded-xl border border-neutral-200 bg-white p-2 text-neutral-700 hover:bg-neutral-100 lg:hidden"
            >
                <Menu className="h-6 w-6" />
            </button>

            <div className="flex-1 min-w-0 max-w-md">
                <GlobalSearch from="top" />
            </div>

            <div className="flex shrink-0 items-center gap-2 sm:gap-4">
                <Notifications />
                <ProfileAction onLogout={handleLogout} />
            </div>
        </div>
    )
}
