import { Bell, Search, User } from "@/components/icons/outline"
import GlobalSearch from "@/components/global-search"
import { ProgressiveBlur } from "@/components/progressive-blur"
import ProfileAction from "@/components/profile-action"
import Notifications from "@/components/notifications"
import { useRouter } from "next/navigation"
import { logout } from "@/helpers/auth"

export default function Topbar() {
    const router = useRouter()

    const handleLogout = async () => {
        await logout()
        router.replace("/login")
    }

    return (
        <div className="px-4 pb-4 pt-7 flex justify-between sticky top-0 space-x-8 z-10">
            <ProgressiveBlur className="w-full -z-10 rounded-t-xl" height="150%" position="top" />
            {/* Search Bar */}
            <div className="flex-1 grow">
                <GlobalSearch from="top" />
            </div>
            {/* Notifications and Profile */}
            <div className="flex items-center space-x-2">
                {/* Notifications */}
                <Notifications />

                {/* Users */}
                <div className="space-x-2 flex items-center">
                    {/* Avatar */}
                    <ProfileAction onLogout={handleLogout} />
                </div>
            </div>
        </div>
    )
}