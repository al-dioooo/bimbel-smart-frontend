'use client'

import { Popover as BasePopover, PopoverButton, PopoverPanel } from "@/components/base/popover"
import { Highlight, HighlightItem } from "@/components/base/highlight"
import { Check, X, ChevronDown } from "@/components/icons/outline"
import { normalizePengajuanStatus, pengajuanStatus, toneClasses } from "@/lib/status"
import { cn } from "@/lib/utils"

type Props = {
    status: string
    onApprove?: () => void
    onReject?: () => void
}

const base = "inline-flex items-center justify-center gap-1 w-32 py-2 rounded-full text-xs font-semibold transition-colors"

export default function PengajuanAction({ status, onApprove, onReject }: Props) {
    const key = normalizePengajuanStatus(status)
    const { label, tone } = pengajuanStatus[key]

    // Settled rows are read-only.
    if (key !== 'pending') {
        return <span className={cn(base, toneClasses[tone], 'border')}>{label}</span>
    }

    return (
        <BasePopover>
            <PopoverButton
                className={cn(
                    base,
                    'cursor-pointer border bg-white border-amber-400 text-amber-600 hover:bg-amber-50',
                    'focus:outline-none focus-visible:ring-2 focus-visible:ring-amber-200'
                )}
            >
                {label}
                <ChevronDown className="w-3 h-3" strokeWidth={2} />
            </PopoverButton>

            <PopoverPanel
                anchor={{ to: "bottom start", gap: 8 }}
                className="w-36 bg-white border border-neutral-200 p-1 z-50 rounded-xl text-xs font-medium shadow-lg"
            >
                <Highlight hover controlledItems className="bg-neutral-100 rounded-lg inset-0 space-y-1">
                    <HighlightItem>
                        <button
                            type="button"
                            onClick={onApprove}
                            className="flex w-full cursor-pointer items-center gap-2 px-3 py-2 text-emerald-600 rounded-md"
                        >
                            <Check className="w-4 h-4" strokeWidth={2} />
                            <span>Setujui</span>
                        </button>
                    </HighlightItem>

                    <HighlightItem>
                        <button
                            type="button"
                            onClick={onReject}
                            className="flex w-full cursor-pointer items-center gap-2 px-3 py-2 text-red-500 rounded-md"
                        >
                            <X className="w-4 h-4" strokeWidth={2} />
                            <span>Tolak</span>
                        </button>
                    </HighlightItem>
                </Highlight>
            </PopoverPanel>
        </BasePopover>
    )
}
