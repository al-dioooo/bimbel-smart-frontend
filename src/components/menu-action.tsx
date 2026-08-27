'use client'

import Link from "next/link"

import { Popover as BasePopover, PopoverButton, PopoverPanel } from "@/components/base/popover"
import { Highlight, HighlightItem } from "@/components/base/highlight"
import { DotsVertical, InfoCircle, Pencil, Trash } from "@/components/icons/outline"

type Props = {
    showDetail?: boolean
    detailLink?: string

    editLink?: string
    editLabel?: string

    /** Omit to hide the destructive item entirely. */
    onDelete?: () => void
    deleteLabel?: string
}

export default function MenuAction({
    showDetail = true,
    detailLink = "",
    editLink,
    editLabel = "Edit",
    onDelete,
    deleteLabel = "Hapus",
}: Props) {
    const hasDetail = showDetail && !!detailLink

    return (
        <BasePopover>
            <PopoverButton className="p-2 rounded-lg hover:bg-neutral-100 cursor-pointer focus:outline-none">
                <DotsVertical className="w-4 h-4" />
                <span className="sr-only">Aksi</span>
            </PopoverButton>
            <PopoverPanel anchor={{ to: "bottom end", gap: 4 }} className="w-44 bg-white border border-neutral-200 shadow-lg p-1 z-50 rounded-xl text-xs">
                <Highlight hover controlledItems className="bg-neutral-100 rounded-lg inset-0">
                    {hasDetail && (
                        <HighlightItem>
                            <Link href={detailLink} className="flex space-x-2 items-center p-2 text-neutral-900">
                                <InfoCircle className="w-4 h-4" />
                                <span>Lihat Detail</span>
                            </Link>
                        </HighlightItem>
                    )}

                    {editLink && (
                        <HighlightItem>
                            <Link href={editLink} className="flex space-x-2 items-center p-2 text-neutral-900">
                                <Pencil className="w-4 h-4" />
                                <span>{editLabel}</span>
                            </Link>
                        </HighlightItem>
                    )}

                    {onDelete && (
                        <>
                            {(hasDetail || editLink) && <hr className="my-1 border-neutral-200" />}
                            <HighlightItem>
                                <button
                                    type="button"
                                    onClick={onDelete}
                                    className="flex w-full cursor-pointer space-x-2 items-center p-2 text-red-500"
                                >
                                    <Trash className="w-4 h-4" />
                                    <span>{deleteLabel}</span>
                                </button>
                            </HighlightItem>
                        </>
                    )}
                </Highlight>
            </PopoverPanel>
        </BasePopover>
    )
}
