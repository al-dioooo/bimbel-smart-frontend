import { Bell, Search, User } from "@/components/icons/outline"

export default function Topbar() {
    return (
        <div className="p-4 flex justify-between sticky top-0 bg-white/20 backdrop-blur-sm rounded-t-xl space-x-8">
            {/* Search Bar */}
            <div className="flex-1 grow">
                <button className="inline-flex rounded-xl justify-center border border-neutral-200 bg-white/80 px-6 py-3 w-full">
                    <div className="inline-flex items-center space-x-2">
                        <span>
                            <Search className="w-4 h-4" />
                        </span>
                        <span className="text-xs">Search</span>
                    </div>
                </button>
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