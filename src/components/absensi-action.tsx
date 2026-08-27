'use client'

import { Popover as BasePopover, PopoverButton, PopoverPanel } from "@/components/base/popover"
import { Highlight, HighlightItem } from "@/components/base/highlight"
import { attendance, attendanceCodes, type AttendanceCode } from "@/lib/status"

type Props = {
    onSelect: (status: AttendanceCode | null) => void
    children: React.ReactNode
    disabled?: boolean
}

export default function AbsensiAction({ onSelect, children, disabled = false }: Props) {
    if (disabled) return <>{children}</>

    return (
        <BasePopover>
            <PopoverButton as="div" className="focus:outline-none cursor-pointer">
                {children}
            </PopoverButton>

            <PopoverPanel
                anchor={{ to: "bottom", gap: 8 }}
                className="w-fit min-w-28 bg-white border border-neutral-200 z-50 rounded-xl shadow-lg overflow-hidden p-1"
            >
                <Highlight hover controlledItems className="bg-neutral-100 rounded-lg inset-0 space-y-1">
                    {attendanceCodes.map((code) => (
                        <HighlightItem key={code}>
                            <button
                                type="button"
                                onClick={() => onSelect(code)}
                                className="flex w-full cursor-pointer items-center justify-between gap-3 px-3 py-2 text-neutral-900 rounded-md"
                            >
                                <span className="font-medium text-xs">{attendance[code].label}</span>
                                <span className="text-[10px] font-bold text-neutral-400">{attendance[code].short}</span>
                            </button>
                        </HighlightItem>
                    ))}

                    <HighlightItem>
                        <button
                            type="button"
                            onClick={() => onSelect(null)}
                            className="flex w-full cursor-pointer items-center px-3 py-2 text-neutral-500 rounded-md"
                        >
                            <span className="font-medium text-xs">Kosongkan</span>
                        </button>
                    </HighlightItem>
                </Highlight>
            </PopoverPanel>
        </BasePopover>
    )
}
