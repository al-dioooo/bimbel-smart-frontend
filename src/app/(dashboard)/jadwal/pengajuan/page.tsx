'use client'
/* eslint-disable @typescript-eslint/no-explicit-any */
import moment from "moment"
import { usePathname, useRouter, useSearchParams } from "next/navigation"
import { useEffect, useRef, useState } from "react"
import { AutoHeight } from "@/components/auto-height"
import { Search } from "@/components/icons/outline"
import PengajuanAction from "@/components/pengajuan-action"
import Filter from "./filter"
import Pagination from "@/components/pagination"
import { ChevronUpDown } from "@/components/icons/dynamic"

// --- MOCK DATA ---
const MOCK_DATA = [
    { id: 1, nama: "Perubahan Jadwal 6 Oktober 2025", created_at: "2025-10-04", status: "Disetujui" },
    { id: 2, nama: "Penambahan Jadwal 18 Oktober 2025", created_at: "2025-10-04", status: "Menunggu" },
    { id: 3, nama: "Penambahan Jadwal 4 Oktober 2025", created_at: "2025-09-27", status: "Disetujui" },
    { id: 4, nama: "Penambahan Jadwal 2 Oktober 2025", created_at: "2025-09-27", status: "Ditolak" },
    { id: 5, nama: "Pemindahan Jadwal 26 September 2025", created_at: "2025-09-21", status: "Disetujui" },
    { id: 6, nama: "Perubahan Jadwal 29 September 2025", created_at: "2025-09-21", status: "Disetujui" },
    { id: 7, nama: "Perubahan Jadwal 30 September 2025", created_at: "2025-09-21", status: "Ditolak" },
    { id: 8, nama: "Perubahan Jadwal 25 September 2025", created_at: "2025-09-21", status: "Ditolak" },
    { id: 9, nama: "Pemindahan Jadwal 15 September 2025", created_at: "2025-09-10", status: "Disetujui" },
];

export default function ListPengajuanPage() {
    const router = useRouter()
    const pathname = usePathname()
    const searchParams = useSearchParams()
    const [searchTemp, setSearchTemp] = useState(searchParams.get('search') ?? "")
    const searchInput = useRef<any>(undefined)

    const page = searchParams.get('page')
    const search = searchParams.get('search')
    const pengajuan = searchParams.get('pengajuan')
    const from = searchParams.get('from')
    const to = searchParams.get('to')
    const orderBy = searchParams.get('order_by')
    const direction = searchParams.get('direction')

    // State Mock Data
    const [pengajuanList, setPengajuanList] = useState(MOCK_DATA);
    const isLoading = false;
    
    // Handler Action Button
    const handleApprove = (id: number) => {
        const updatedList = pengajuanList.map(item => 
            item.id === id ? { ...item, status: "Disetujui" } : item
        );
        setPengajuanList(updatedList);
    };

    const handleReject = (id: number) => {
        const updatedList = pengajuanList.map(item => 
            item.id === id ? { ...item, status: "Ditolak" } : item
        );
        setPengajuanList(updatedList);
    };
    
    const toggleSort = (value: string) => {
        console.log("Sort triggered:", value);
    }

    const updateFilter = (values: Record<string, string | null>) => { console.log("Filter:", values) }
    const removeFilter = () => { console.log("Filter removed") }

    return (
        <div className="space-y-6">
            <h1 className="text-3xl font-semibold">Pengajuan</h1>

            <div className="space-y-6">
                <div className="flex items-center justify-between text-xs">
                    <div className="flex items-center sm:space-x-2">
                        <div className="relative hidden sm:block">
                            <div className="absolute inset-y-0 flex items-center pl-3 pointer-events-none">
                                <Search className="w-4 h-4" />
                            </div>
                            <input ref={searchInput} onChange={(e) => setSearchTemp(e.target.value)} value={searchTemp} type="text" placeholder="Cari data" autoComplete="off" className="w-64 py-3 pl-8 pr-4 text-xs transition border border-neutral-200 focus:outline-none rounded-full focus:border-sky-400 focus:ring-2 focus:ring-sky-200" />
                        </div>
                        <Filter onSubmit={updateFilter} onRemove={removeFilter} data={Object.fromEntries(Object.entries({ pengajuan, from, to }).filter(([_, v]) => v != null))} />
                    </div>
                </div>
                <div className="overflow-x-auto border border-neutral-200 rounded-xl">
                    <AutoHeight>
                        <table className="min-w-full overflow-x-auto divide-y divide-neutral-200">
                            <thead className="bg-neutral-50 rounded-t-3xl">
                                <tr>
                                    {/* HAPUS KOLOM NO DISINI */}
                                    <th scope="col" className="cursor-pointer px-6 py-3 text-xs font-medium text-left uppercase text-neutral-500 whitespace-nowrap">
                                        <button className="flex cursor-pointer items-center space-x-1 text-xs font-medium text-left uppercase text-neutral-500" onClick={() => toggleSort('pengajuan')}>
                                            <span>Nama Pengajuan</span>
                                            <span><ChevronUpDown direction={orderBy === ('pengajuan') ? (direction === 'asc' ? 'up' : 'down') : false} className="w-4 h-4" strokeWidth={2} /></span>
                                        </button>
                                    </th>
                                    <th scope="col" className="cursor-pointer px-6 py-3 text-xs font-medium text-left uppercase text-neutral-500 whitespace-nowrap">
                                        <button className="flex cursor-pointer items-center space-x-1 text-xs font-medium text-left uppercase text-neutral-500" onClick={() => toggleSort('tingkat')}>
                                            <span>Tanggal Pengajuan</span>
                                            <span><ChevronUpDown direction={orderBy === ('tingkat') ? (direction === 'asc' ? 'up' : 'down') : false} className="w-4 h-4" strokeWidth={2} /></span>
                                        </button>
                                    </th>
                                    <th scope="col" className="px-6 py-3 text-xs font-medium text-left uppercase text-neutral-500 whitespace-nowrap">
                                        Status
                                    </th>
                                </tr>
                            </thead>
                            <tbody className="bg-white divide-y divide-neutral-200">
                                {isLoading && (
                                    <tr><td colSpan={3} className="px-6 py-4 text-center text-xs">Loading...</td></tr>
                                )}

                                {pengajuanList.length === 0 && !isLoading && (
                                    <tr><td colSpan={3} className="px-6 py-4 text-center text-xs">No Data Available</td></tr>
                                )}

                                {pengajuanList.map((row) => (
                                    <tr key={row.id} className="hover:bg-neutral-50 transition-colors">
                                        <td className="px-6 py-4 text-xs font-medium text-neutral-900 whitespace-nowrap">
                                            {row.nama}
                                        </td>
                                        <td className="px-6 py-4 text-xs text-neutral-500 whitespace-nowrap">
                                            {moment(row.created_at).format('D-MM-YYYY')}
                                        </td>
                                        <td className="px-6 py-4 text-xs whitespace-nowrap">
                                            <PengajuanAction 
                                                status={row.status}
                                                onApprove={() => handleApprove(row.id)}
                                                onReject={() => handleReject(row.id)}
                                            />
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </AutoHeight>
                </div>
            </div>
        </div>
    )
}