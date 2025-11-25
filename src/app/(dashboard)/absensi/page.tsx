'use client'

/* eslint-disable @typescript-eslint/no-explicit-any */
import { useState, useEffect, useRef } from "react"
import { usePathname, useRouter, useSearchParams } from "next/navigation"

// Icons
import { Search } from "@/components/icons/outline"

// Components
import SelectDescription from "@/components/forms/select-description"
import AbsensiTable from "@/components/absensi-table"

// --- LOCAL ICON COMPONENT: SAVE ---
const SaveIcon = ({ className }: { className?: string }) => (
    <svg 
        xmlns="http://www.w3.org/2000/svg" 
        className={className} 
        width="24" 
        height="24" 
        viewBox="0 0 24 24" 
        strokeWidth="1.5" 
        stroke="currentColor" 
        fill="none" 
        strokeLinecap="round" 
        strokeLinejoin="round"
    >
        <path stroke="none" d="M0 0h24v24H0z" fill="none"/>
        <path d="M6 4h10l4 4v10a2 2 0 0 1 -2 2h-12a2 2 0 0 1 -2 -2v-12a2 2 0 0 1 2 -2" />
        <path d="M12 14m-2 0a2 2 0 1 0 4 0a2 2 0 1 0 -4 0" />
        <path d="M14 4l0 4l-6 0l0 -4" />
    </svg>
)

// --- Mock Data untuk Pilihan Kelas ---
const CLASS_OPTIONS = [
    { id: 1, name: "Kelas 10 IPA 1", description: "Wali Kelas: Budi Santoso" },
    { id: 2, name: "Kelas 10 IPA 2", description: "Wali Kelas: Siti Aminah" },
    { id: 3, name: "Kelas 11 IPS 1", description: "Wali Kelas: Joko Anwar" },
    { id: 4, name: "Kelas 12 Bahasa", description: "Wali Kelas: Rina Nose" },
]

export default function ListAbsensiPage() {
    const router = useRouter()
    const pathname = usePathname()
    const searchParams = useSearchParams()

    // --- 1. Search Logic ---
    const [searchTemp, setSearchTemp] = useState(searchParams.get('search') ?? "")
    const searchInput = useRef<HTMLInputElement>(null)
    const search = searchParams.get('search')

    // Debounce effect
    useEffect(() => {
        const timeOut = setTimeout(() => {
            const current = new URLSearchParams(searchParams.toString())

            if (searchTemp !== search) {
                if (searchTemp !== "") {
                    current.set('search', searchTemp)
                } else {
                    current.delete('search')
                }
                router.replace(`${pathname}?${current.toString()}`)
            }
        }, 500)

        return () => clearTimeout(timeOut)
    }, [searchTemp, search, pathname, router, searchParams])


    // --- 2. Filter Kelas State ---
    const [selectedClass, setSelectedClass] = useState<any>(null)

    const handleClassChange = (val: any) => {
        setSelectedClass(val)
    }

    // --- 3. Handler Simpan ---
    const handleSave = () => {
        console.log("Simpan data...")
    }

    return (
        <div className="w-full space-y-6 pb-20">
            {/* Container Card */}
            <div className="space-y-4">
                
                {/* --- TOOLBAR --- */}
                <div className="flex flex-col md:flex-row justify-between items-center gap-4">
                    
                    {/* BAGIAN KIRI: Search & Filter */}
                    <div className="flex flex-col sm:flex-row items-center gap-2 w-full md:w-auto">
                        
                        {/* 1. Input Search */}
                        <div className="relative w-full sm:w-64">
                            <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                                <Search className="w-4 h-4 text-neutral-400" />
                            </div>
                            <input 
                                ref={searchInput} 
                                onChange={(e) => setSearchTemp(e.target.value)} 
                                value={searchTemp} 
                                type="text" 
                                placeholder="Cari Siswa" 
                                autoComplete="off" 
                                className="w-full py-2 pl-9 pr-4 text-sm transition border border-neutral-200 rounded-full focus:outline-none focus:border-sky-400 focus:ring-2 focus:ring-sky-200 placeholder-neutral-400" 
                            />
                        </div>

                        {/* 2. Filter Kelas */}
                        <div className="w-full sm:w-48">
                            <SelectDescription
                                title={(row) => row.name}
                                description={(row) => row.description}
                                keyValue={(row) => row.id}
                                selection={CLASS_OPTIONS}
                                isLoading={false}
                                placeholder="Kelas"
                                value={selectedClass}
                                onChange={handleClassChange}
                            />
                        </div>
                    </div>

                    {/* BAGIAN KANAN: Tombol Simpan */}
                    <div className="w-full md:w-auto flex justify-end">
                        <button 
                            onClick={handleSave}
                            className="flex items-center space-x-2 px-5 py-2 border border-sky-500 text-sky-500 rounded-full hover:bg-sky-50 transition-colors text-sm font-semibold"
                        >
                            {/* Menggunakan komponen SaveIcon lokal */}
                            <SaveIcon className="w-4 h-4" />
                            <span>Simpan</span>
                        </button>
                    </div>
                </div>

                {/* --- TABEL --- */}
                <div className="mt-2">
                    <AbsensiTable searchQuery={search || ""} />
                </div>
            </div>
        </div>
    )
}