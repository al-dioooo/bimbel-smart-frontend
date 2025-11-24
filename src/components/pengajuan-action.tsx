'use client'
import { Popover as BasePopover, PopoverButton, PopoverPanel } from "@/components/base/popover"
import { Highlight, HighlightItem } from "@/components/base/highlight"

const CheckIcon = () => <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-4 h-4"><path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" /></svg>
const XMarkIcon = () => <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-4 h-4"><path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" /></svg>
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

    const baseClasses = "inline-flex items-center justify-center w-32 py-2 rounded-full text-xs font-semibold transition-all duration-200"

    if (status === 'Menunggu') {
        return (
            <BasePopover>
                <PopoverButton 
                    className={`${baseClasses} bg-white ring-1 ring-inset ring-amber-500 text-amber-500 hover:bg-amber-50 data-[headlessui-state=open]:bg-amber-50 data-[open]:bg-amber-50 focus:outline-none focus:ring-1`}
                >
                    {status}
                    <ChevronDownIcon />
                </PopoverButton>

                {/* Dropdown Panel */}
                <PopoverPanel anchor={{ to: "bottom start", gap: 8 }} className="w-32 bg-white border border-neutral-200 p-1 z-50 rounded-xl text-xs font-medium shadow-lg">
                    <Highlight hover controlledItems className="bg-neutral-100 rounded-lg inset-0 space-y-1">
                        
                        {/* Tombol Setujui */}
                        <HighlightItem>
                            <button 
                                onClick={onApprove} 
                                className="flex w-full cursor-pointer items-center px-3 py-2 text-emerald-500 hover:bg-emerald-50 rounded-md transition-colors space-x-2"
                            >
                                <CheckIcon />
                                <span>Setujui</span>
                            </button>
                        </HighlightItem>

                        {/* Tombol Tolak */}
                        <HighlightItem>
                            <button 
                                onClick={onReject} 
                                className="flex w-full cursor-pointer items-center px-3 py-2 text-red-500 hover:bg-red-50 rounded-md transition-colors space-x-2"
                            >
                                <XMarkIcon />
                                <span>Tolak</span>
                            </button>
                        </HighlightItem>

                    </Highlight>
                </PopoverPanel>
            </BasePopover>
        )
    }

    if (status === 'Disetujui') {
        return (
            <span className={`${baseClasses} bg-emerald-100 text-emerald-500`}>
                {status}
            </span>
        )
    }

    if (status === 'Ditolak') {
        return (
            <span className={`${baseClasses} bg-red-100 text-red-500`}>
                {status}
            </span>
        )
    }

    return (
        <span className={`${baseClasses} bg-gray-100 text-gray-500`}>
            {status}
        </span>
    )
}