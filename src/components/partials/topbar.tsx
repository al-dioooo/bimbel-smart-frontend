import { Bell, Search, User } from "@/components/icons/outline"
import GlobalSearch from "@/components/global-search"
import { ProgressiveBlur } from "@/components/progressive-blur"

export default function Topbar() {
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
                <button className="p-2 rounded-xl border border-sky-200">
                    <Bell className="text-sky-500 w-6 h-6" />
                </button>

                {/* Users */}
                <div className="space-x-2 flex items-center">
                    {/* Avatar */}
                    <div className="p-2 rounded-xl bg-radial-[at_20%_20%] from-sky-500 to-sky-300">
                        <User className="text-white w-6 h-6" />
                    </div>
                    <div>
                        <p className="text-sm font-medium">Alice Evergarden</p>
                        <p className="text-sm">Administrator</p>
                    </div>
                </div>
            </div>
        </div>
    )
}