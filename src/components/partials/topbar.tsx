import { Bell, Search, User } from "@/components/icons/outline"
import GlobalSearch from "@/components/global-search"
import { ProgressiveBlur } from "@/components/progressive-blur"
import ProfileAction from "@/components/profile-action"
import Notifications from "@/components/notifications"

export default function Topbar() {

    const handleLogout = () => {
        console.log("User logged out")
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
                <Notifications>
                    <button className="p-2 rounded-xl border border-sky-200">
                        <Bell className="text-sky-500 w-6 h-6" />
                    </button>
                </Notifications>

                {/* Users */}
                <div className="space-x-2 flex items-center">
                    {/* Avatar */}
                    <ProfileAction onLogout={handleLogout}>
                        <div className="p-2 rounded-xl bg-radial-[at_20%_20%] from-sky-500 to-sky-300">
                            <User className="text-white w-6 h-6" />
                        </div>
                    </ProfileAction>
                    <div>
                        <p className="text-sm font-medium">Alice Evergarden</p>
                        <p className="text-sm">Administrator</p>
                    </div>
                </div>
            </div>
        </div>
    )
}