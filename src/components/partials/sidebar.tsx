import Logo from "@/components/logo"
import SidebarLink from "@/components/sidebar-link"
import { Book, Calendar, Database, SmartHome, Wallet } from "@/components/icons/outline"

type Props = {}

export default function Sidebar({ }: Props) {
    return (
        <div className="space-y-8 p-4 max-w-2xs h-screen w-full fixed">
            {/* Logo */}
            <div className="inline-flex justify-center space-x-4 items-center p-2 bg-neutral-100 rounded-2xl w-full">
                <Logo className="w-12 h-12" />
                <span className="font-medium text-sm uppercase">Bimbel Smart</span>
            </div>

            {/* Links */}
            <nav>
                <ul className="flex flex-col space-y-1">
                    <li className="flex-1">
                        <SidebarLink type="main" label="Dashboard" href="/" icon={<SmartHome className="w-5 h-5" />} activePath="/" exact />
                    </li>
                    <li className="flex-1">
                        <SidebarLink type="main" label="Absensi" href="/absensi" icon={<Book className="w-5 h-5" />} activePath="/absensi" exact />
                    </li>
                    <li className="flex-1">
                        <SidebarLink type="main" label="Jadwal" href="/jadwal" icon={<Calendar className="w-5 h-5" />} activePath="/jadwal" />
                        <SidebarLink type="sublink" label="Calendar" href="/jadwal" activePath="/jadwal" exact />
                        <SidebarLink type="sublink" label="List" href="/jadwal/list" activePath="/jadwal/list" exact />
                        <SidebarLink type="sublink" label="Pengajuan" href="/jadwal/pengajuan" activePath="/jadwal/pengajuan" exact />
                    </li>
                    <li className="flex-1">
                        <SidebarLink type="main" label="Gaji" href="/aturan-gaji" icon={<Wallet className="w-5 h-5" />} activePath="/aturan-gaji" exact />
                    </li>
                    <li className="flex-1">
                        <SidebarLink type="main" label="Data" href="/data/kelas" icon={<Database className="w-5 h-5" />} activePath="/data" />
                        <SidebarLink type="sublink" label="Kelas" href="/data/kelas" activePath="/data/kelas" exact />
                        <SidebarLink type="sublink" label="Mentor" href="/data/mentor" activePath="/data/mentor" exact />
                        <SidebarLink type="sublink" label="Siswa" href="/data/siswa" activePath="/data/siswa" exact />
                    </li>
                    <li>
                        <SidebarLink type="main" label="Report" href="/report/absensi" icon={<Database className="w-5 h-5" />} activePath="/report" />
                        <SidebarLink type="sublink" label="Absensi" href="/report/absensi" activePath="/report/absensi" exact />
                        <SidebarLink type="sublink" label="Gaji" href="/report/gaji" activePath="/report/gaji" exact />
                    </li>
                </ul>
            </nav>
        </div>
    )
}