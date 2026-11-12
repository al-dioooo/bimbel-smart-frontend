'use client'

import Logo from "@/components/logo"
import SidebarLink from "@/components/sidebar-link"
import { Book, Calendar, ChartBar, Database, SmartHome, Wallet } from "@/components/icons/outline"
import { useAccess } from "@/hooks/use-user"
import { useSidebar } from "@/components/partials/sidebar-state"
import { X } from "@/components/icons/outline"
import { cn } from "@/lib/utils"

/**
 * Fixed rail from lg up; below that a drawer opened from the top bar's menu
 * button, over a backdrop (N4: the fixed 288 px rail left no room at 360 px).
 */
export default function Sidebar() {
    const { user, isAdmin } = useAccess()
    const { open, setOpen } = useSidebar()

    return (
        <>
        <div
            aria-hidden
            onClick={() => setOpen(false)}
            className={cn("fixed inset-0 z-40 bg-black/40 transition-opacity lg:hidden", open ? "opacity-100" : "pointer-events-none opacity-0")}
        />
        <aside
            id="sidebar"
            aria-label="Menu navigasi"
            className={cn(
                "space-y-8 p-4 w-72 h-dvh fixed inset-y-0 left-0 z-50 overflow-y-auto bg-neutral-50 transition-transform duration-200",
                "lg:z-auto lg:translate-x-0 lg:bg-transparent",
                open ? "translate-x-0 shadow-xl" : "-translate-x-full"
            )}
        >
            <button
                type="button"
                onClick={() => setOpen(false)}
                aria-label="Tutup menu navigasi"
                className="absolute right-3 top-3 rounded-lg p-2 text-neutral-500 hover:bg-neutral-200 lg:hidden"
            >
                <X className="h-5 w-5" />
            </button>

            <div className="inline-flex justify-center gap-3 items-center p-2 bg-neutral-100 rounded-xl w-full">
                <Logo className="w-12 h-12" />
                <span className="font-medium text-sm uppercase">Bimbel Smart</span>
            </div>

            {/* Nothing until /me resolves, so a mentor never sees admin links flash by. */}
            {user && (
                <nav>
                    <ul className="flex flex-col space-y-1">
                        <li>
                            <SidebarLink type="main" label="Dashboard" href="/" icon={<SmartHome className="w-5 h-5" />} activePath="/" exact />
                        </li>
                        <li>
                            <SidebarLink type="main" label="Absensi" href="/absensi" icon={<Book className="w-5 h-5" />} activePath="/absensi" exact />
                        </li>
                        <li className="space-y-1">
                            <SidebarLink type="main" label="Jadwal" href="/jadwal" icon={<Calendar className="w-5 h-5" />} activePath="/jadwal" />
                            <SidebarLink type="sublink" label="Kalender" href="/jadwal" activePath="/jadwal" exact />
                            <SidebarLink type="sublink" label="Daftar" href="/jadwal/list" activePath="/jadwal/list" exact />
                            <SidebarLink type="sublink" label="Pengajuan" href="/jadwal/pengajuan" activePath="/jadwal/pengajuan" />
                        </li>
                        {isAdmin && (
                            <>
                                <li className="space-y-1">
                                    <SidebarLink type="main" label="Gaji" href="/gaji/proses" icon={<Wallet className="w-5 h-5" />} activePath="/gaji" />
                                    <SidebarLink type="sublink" label="Proses Gaji" href="/gaji/proses" activePath="/gaji/proses" />
                                    <SidebarLink type="sublink" label="Aturan Gaji" href="/aturan-gaji" activePath="/aturan-gaji" />
                                </li>
                                <li className="space-y-1">
                                    <SidebarLink type="main" label="Data" href="/data/kelas" icon={<Database className="w-5 h-5" />} activePath="/data" />
                                    <SidebarLink type="sublink" label="Kelas" href="/data/kelas" activePath="/data/kelas" />
                                    <SidebarLink type="sublink" label="Mentor" href="/data/mentor" activePath="/data/mentor" />
                                    <SidebarLink type="sublink" label="Siswa" href="/data/siswa" activePath="/data/siswa" />
                                </li>
                            </>
                        )}
                        <li className="space-y-1">
                            {/* Laporan had the same Database icon as Data. */}
                            <SidebarLink type="main" label="Laporan" href="/report/absensi" icon={<ChartBar className="w-5 h-5" />} activePath="/report" />
                            <SidebarLink type="sublink" label="Absensi" href="/report/absensi" activePath="/report/absensi" />
                            {isAdmin ? (
                                <SidebarLink type="sublink" label="Gaji" href="/report/gaji" activePath="/report/gaji" />
                            ) : user.mentor && (
                                <SidebarLink type="sublink" label="Gaji Saya" href={`/report/gaji/${user.mentor.id}`} activePath="/report/gaji" />
                            )}
                        </li>
                    </ul>
                </nav>
            )}
        </aside>
        </>
    )
}
