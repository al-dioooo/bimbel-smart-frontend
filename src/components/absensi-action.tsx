'use client'

import { useClose } from "@headlessui/react"

import { Popover as BasePopover, PopoverButton, PopoverPanel } from "@/components/base/popover"
import { Highlight, HighlightItem } from "@/components/base/highlight"
import { attendance, attendanceCodes, type AttendanceCode } from "@/lib/status"

type Props = {
    onSelect: (status: AttendanceCode | null) => void
    children: React.ReactNode
    disabled?: boolean
    /** REQ-044: an optional short note for this siswa on this session. */
    note?: string
    onNoteChange?: (note: string) => void
}

export const CATATAN_MAX = 255

export default function AbsensiAction({ onSelect, children, disabled = false, note, onNoteChange }: Props) {
    if (disabled) return <>{children}</>

    return (
        <BasePopover>
            <PopoverButton as="div" className="focus:outline-none cursor-pointer">
                {children}
            </PopoverButton>

            <PopoverPanel
                anchor={{ to: "bottom", gap: 8 }}
                className="w-56 bg-white border border-neutral-200 z-50 rounded-xl shadow-lg overflow-hidden p-1"
            >
                <StatusOptions onSelect={onSelect} />

                {onNoteChange && (
                    <label className="mt-1 block border-t border-neutral-100 px-2 pb-1 pt-2 text-left">
                        <span className="text-[11px] font-medium text-neutral-500">Catatan (opsional)</span>
                        <input
                            type="text"
                            value={note ?? ''}
                            maxLength={CATATAN_MAX}
                            onChange={(e) => onNoteChange(e.target.value)}
                            placeholder="Contoh: acara keluarga"
                            className="mt-1 w-full rounded-lg border border-neutral-200 px-2 py-1.5 text-xs focus:border-neutral-400 focus:outline-none"
                        />
                    </label>
                )}
            </PopoverPanel>
        </BasePopover>
    )
}

/** Inside the panel, so choosing a status can close the menu. */
function StatusOptions({ onSelect }: { onSelect: Props['onSelect'] }) {
    const close = useClose()
    const choose = (status: AttendanceCode | null) => {
        onSelect(status)
        close()
    }

    return (
        <Highlight hover controlledItems className="bg-neutral-100 rounded-lg inset-0 space-y-1">
            {attendanceCodes.map((code) => (
                <HighlightItem key={code}>
                    <button
                        type="button"
                        onClick={() => choose(code)}
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
                    onClick={() => choose(null)}
                    className="flex w-full cursor-pointer items-center px-3 py-2 text-neutral-500 rounded-md"
                >
                    <span className="font-medium text-xs">Kosongkan</span>
                </button>
            </HighlightItem>
        </Highlight>
    )
}
