'use client'

import { Popover as BasePopover, PopoverButton, PopoverPanel, PopoverPanelProps } from "@/components/base/popover"
import { Highlight, HighlightItem } from "@/components/base/highlight"
import Link from "next/link"
import { DotsVertical, InfoCircle, Pencil, Trash } from "@/components/icons/outline"

type Props = {
    showDetail?: boolean
    detailLink?: string
    editLink: string
    editLabel?: string
    deleteLink: string
    deleteLabel?: string
}

export default function MenuAction({ showDetail = true, detailLink = "", editLink, deleteLink, editLabel = "Edit Data", deleteLabel = "Delete Data" }: Props) {
    return (
        <BasePopover>
            <PopoverButton className="p-2 rounded-lg hover:bg-neutral-100 cursor-pointer focus:outline-none">
                <DotsVertical className="w-4 h-4" />
            </PopoverButton>
            <PopoverPanel anchor={{ to: "bottom end", gap: 4 }} className="w-48 bg-background border p-2 z-50 rounded-xl text-xs">
                <Highlight hover controlledItems className="bg-neutral-100 rounded-lg inset-0">
                    <HighlightItem>
                        <Link href={detailLink} className="flex space-x-2 items-center p-2">
                            <div>
                                <InfoCircle className="w-4 h-4" />
                            </div>
                            <div>Lihat Detail</div>
                        </Link>
                    </HighlightItem>

                    <HighlightItem>
                        <Link href={editLink} className="flex space-x-2 items-center p-2">
                            <div>
                                <Pencil className="w-4 h-4" />
                            </div>
                            <div>{editLabel}</div>
                        </Link>
                    </HighlightItem>

                    <hr className="m-2" />

                    <HighlightItem>
                        <button onClick={() => { }} className="flex w-full cursor-pointer space-x-2 items-center p-2 text-red-500">
                            <div>
                                <Trash className="w-4 h-4" />
                            </div>
                            <div>{deleteLabel}</div>
                        </button>
                    </HighlightItem>
                </Highlight>
            </PopoverPanel>
        </BasePopover>
    )
}