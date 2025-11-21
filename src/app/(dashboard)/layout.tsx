import Sidebar from "@/components/partials/sidebar"
import Topbar from "@/components/partials/topbar"

export default function DashboardLayout({ children }: Readonly<{ children: React.ReactNode }>) {
    return (
        <div className="flex">
            <Sidebar />
            <div className="ml-72 flex flex-col w-full bg-white min-h-screen mx-3 rounded-xl">
                <Topbar />
                <div className="px-4 pb-4 pt-8">
                    {children}
                </div>
            </div>
        </div>
    )
}
