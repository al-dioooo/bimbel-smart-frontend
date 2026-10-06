'use client'

import { Suspense, useEffect } from "react"
import Link from "next/link"
import { usePathname, useRouter } from "next/navigation"

import Sidebar from "@/components/partials/sidebar"
import Topbar from "@/components/partials/topbar"
import { useUser } from "@/hooks/use-user"
import { canAccess } from "@/lib/access"

function PageFallback() {
    return (
        <div className="space-y-6">
            <div className="h-9 w-56 rounded-lg bg-neutral-100 animate-pulse" />
            <div className="h-64 rounded-xl border border-neutral-200 bg-neutral-50 animate-pulse" />
        </div>
    )
}

function Forbidden() {
    return (
        <div className="rounded-xl border border-neutral-200 bg-neutral-50 px-6 py-12 text-center space-y-2">
            <p className="text-lg font-semibold">Akses ditolak</p>
            <p className="text-sm text-neutral-500">Halaman ini tidak tersedia untuk akun Anda.</p>
            <Link href="/" className="inline-block text-sm font-semibold text-sky-500 hover:text-sky-600">
                Kembali ke Dashboard
            </Link>
        </div>
    )
}

/**
 * Role gate. The proxy only knows a token exists, so the role check happens
 * here once /me resolves; pages do not mount (or fetch) before that.
 */
function RoleGate({ children }: { children: React.ReactNode }) {
    const router = useRouter()
    const pathname = usePathname()
    const { user, isLoading, isError } = useUser()

    useEffect(() => {
        if (isError) router.replace("/login")
    }, [isError, router])

    if (isLoading || !user) return <PageFallback />
    if (!canAccess(user, pathname)) return <Forbidden />

    return children
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
                        <RoleGate>{children}</RoleGate>
                    </Suspense>
                </div>
            </div>
        </div>
    )
}
