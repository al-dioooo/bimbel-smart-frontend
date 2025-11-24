'use client'

import { useState, useRef, useEffect } from "react"

// --- Icons ---
const CheckIcon = () => <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-4 h-4"><path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" /></svg>
const XMarkIcon = () => <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-4 h-4"><path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" /></svg>
// Icon Chevron Kecil untuk indikator dropdown
const ChevronDownIcon = () => <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-3 h-3 ml-1"><path strokeLinecap="round" strokeLinejoin="round" d="M19.5 8.25l-7.5 7.5-7.5-7.5" /></svg>

interface PengajuanActionProps {
    status: string
    onApprove?: () => void
    onReject?: () => void
}

export default function PengajuanAction({
    status,
    onApprove,
    onReject
}: PengajuanActionProps) {
    const [isOpen, setIsOpen] = useState(false)
    const menuRef = useRef<HTMLDivElement>(null)

    useEffect(() => {
        function handleClickOutside(event: MouseEvent) {
            if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
                setIsOpen(false)
            }
        }
        document.addEventListener("mousedown", handleClickOutside)
        return () => document.removeEventListener("mousedown", handleClickOutside)
    }, [menuRef])

    // --- STYLE DASAR (Agar Ukuran Sama) ---
    // w-32 : Lebar fix (sekitar 128px)
    // py-2 : Tinggi padding atas bawah sama
    // justify-center : Teks rata tengah
    const baseClasses = "inline-flex items-center justify-center w-32 py-2 rounded-full text-xs font-semibold transition-all duration-200"

    // --- RENDER LOGIC ---

    // 1. Status MENUNGGU (Interactive Dropdown)
    if (status === 'Menunggu') {
        return (
            <div className="relative inline-block text-left" ref={menuRef}>
                <button
                    onClick={() => setIsOpen(!isOpen)}
                    // PERUBAHAN DI SINI:
                    // Hapus: border border-amber-200
                    // Ganti dengan: ring-1 ring-inset ring-amber-200
                    className={`${baseClasses} bg-white ring-1 ring-inset ring-amber-500 text-amber-500 hover:bg-amber-50 focus:outline-none focus:ring-1 focus:ring-amber-500`}
                >
                    {status}
                    <ChevronDownIcon />
                </button>

                {/* Pop Up Dropdown */}
                {isOpen && (
                    <div className="absolute left-0 z-50 mt-1 w-32 bg-white border border-neutral-200 rounded-xl shadow-lg origin-top-left p-1 animate-in fade-in zoom-in-95 duration-100">
                        <div className="flex flex-col space-y-1">
                            <button 
                                onClick={() => { onApprove?.(); setIsOpen(false); }} 
                                className="flex items-center w-full px-3 py-2 text-xs font-medium text-emerald-500 hover:bg-emerald-50 rounded-lg transition-colors space-x-2"
                            >
                                <CheckIcon />
                                <span>Setujui</span>
                            </button>
                            <button 
                                onClick={() => { onReject?.(); setIsOpen(false); }} 
                                className="flex items-center w-full px-3 py-2 text-xs font-medium text-red-500 hover:bg-red-50 rounded-lg transition-colors space-x-2"
                            >
                                <XMarkIcon />
                                <span>Tolak</span>
                            </button>
                        </div>
                    </div>
                )}
            </div>
        )
    }

    // 2. Status DISETUJUI (Static Badge)
    if (status === 'Disetujui') {
        return (
            // Style khusus Disetujui: Hijau background, Teks Hijau Tua
            <span className={`${baseClasses} bg-emerald-100 text-emerald-500`}>
                {status}
            </span>
        )
    }

    // 3. Status DITOLAK (Static Badge)
    if (status === 'Ditolak') {
        return (
            // Style khusus Ditolak: Merah background, Teks Merah
            <span className={`${baseClasses} bg-red-100 text-red-500`}>
                {status}
            </span>
        )
    }

    // Fallback jika ada status lain
    return (
        <span className={`${baseClasses} bg-gray-100 text-gray-600`}>
            {status}
        </span>
    )
}