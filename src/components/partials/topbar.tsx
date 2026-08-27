'use client'

import { useRouter } from "next/navigation"

import GlobalSearch from "@/components/global-search"
import { ProgressiveBlur } from "@/components/progressive-blur"
import ProfileAction from "@/components/profile-action"
import Notifications from "@/components/notifications"
import { logout } from "@/helpers/auth"

export default function Topbar() {
    const router = useRouter()

    const handleLogout = async () => {
        try {
            await logout()
        } finally {
            router.replace("/login")
        }
    }

    return (
        <div className="px-6 pb-4 pt-6 flex justify-between items-center sticky top-0 gap-4 z-10 rounded-t-xl">
            <ProgressiveBlur className="w-full -z-10 rounded-t-xl" height="150%" position="top" />

            <div className="flex-1 max-w-md">
                <GlobalSearch from="top" />
            </div>

            <div className="flex items-center gap-4">
                <Notifications />
                <ProfileAction onLogout={handleLogout} />
            </div>
        </div>
    )
}
