'use client'

import { Suspense } from "react"

import Sidebar from "@/components/partials/sidebar"
import Topbar from "@/components/partials/topbar"

function PageFallback() {
    return (
        <div className="space-y-6">
            <div className="h-9 w-56 rounded-lg bg-neutral-100 animate-pulse" />
            <div className="h-64 rounded-xl border border-neutral-200 bg-neutral-50 animate-pulse" />
        </div>
    )
}

export default function DashboardLayout({ children }: Readonly<{ children: React.ReactNode }>) {
    return (
        <div className="flex">
            <Sidebar />
            <div className="ml-72 mr-3 my-3 flex flex-col w-full min-h-[calc(100vh-1.5rem)] bg-white border border-neutral-200 rounded-xl">
                <Topbar />
                <div className="px-6 pb-8 pt-4">
                    {/* Every list page reads useSearchParams; one boundary here covers them all. */}
                    <Suspense fallback={<PageFallback />}>
                        {children}
                    </Suspense>
                </div>
            </div>
        </div>
    )
}
