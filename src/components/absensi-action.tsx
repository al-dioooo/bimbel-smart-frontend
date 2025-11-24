'use client'

import { Popover as BasePopover, PopoverButton, PopoverPanel } from "@/components/base/popover"
import { Highlight, HighlightItem } from "@/components/base/highlight"

// Definisikan tipe status yang valid
export type AttendanceStatus = 'H' | 'S' | 'I' | 'A'

type Props = {
    onSelect: (status: AttendanceStatus) => void
    children: React.ReactNode 
}

export default function AbsensiAction({ onSelect, children }: Props) {
    
    // Helper function: 
    // - Ditambahkan 'justify-center' agar teks berada di tengah
    // - Padding diubah jadi 'px-4' (16px) sesuai request
    const renderItem = (label: string, value: AttendanceStatus) => (
        <HighlightItem>
            <button 
                onClick={() => onSelect(value)} 
                className="flex w-full cursor-pointer items-center justify-center px-4 py-2 text-neutral-900 transition-colors rounded-md hover:bg-neutral-100"
            >
                <span className="font-medium text-xs text-center">{label}</span>
            </button>
        </HighlightItem>
    )

    return (
        <BasePopover>
            {/* Trigger Button */}
            <PopoverButton as="div" className="focus:outline-none cursor-pointer">
                {children}
            </PopoverButton>

            {/* Panel Menu: 
                - Menggunakan 'w-fit' agar lebar panel nge-hug konten (tidak kepanjangan)
                - Tetap ada border & shadow
            */}
            <PopoverPanel anchor={{ to: "bottom", gap: 8 }} className="w-fit bg-white border border-neutral-200 z-50 rounded-xl shadow-xl overflow-hidden p-1">
                
                <Highlight hover controlledItems className="bg-neutral-100 rounded-lg inset-0 space-y-1">
                    
                    {renderItem("Hadir", "H")}
                    {renderItem("Sakit", "S")}
                    {renderItem("Izin", "I")}
                    {renderItem("Alpa", "A")}

                </Highlight>
            </PopoverPanel>
        </BasePopover>
    )
}