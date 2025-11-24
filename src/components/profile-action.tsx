'use client'

import { Popover as BasePopover, PopoverButton, PopoverPanel } from "@/components/base/popover"
import { Highlight, HighlightItem } from "@/components/base/highlight"
import Link from "next/link"
import { User, Logout } from "@/components/icons/outline" 

type Props = {
    biodataLink?: string
    onLogout?: () => void
    children?: React.ReactNode
}

export default function ProfileAction({ 
    biodataLink = "/biodata", 
    onLogout, 
    children 
}: Props) {
    return (
        <BasePopover>
            <PopoverButton className="rounded-full hover:bg-neutral-100 cursor-pointer focus:outline-none transition-colors">
                {children ? (
                    children
                ) : (
                    <div className="p-2">
                        <User className="w-5 h-5" />
                    </div>
                )}
            </PopoverButton>

            {/* Panel Menu */}
            <PopoverPanel anchor={{ to: "bottom end", gap: 8 }} className="w-48 bg-background border p-1 z-50 rounded-xl text-sm font-medium shadow-md">
                <Highlight hover controlledItems className="bg-neutral-100 rounded-lg inset-0 space-y-1">
                    
                    {/* Menu Biodata */}
                    <HighlightItem>
                        <Link href={biodataLink} className="flex space-x-3 items-center px-3 py-2.5 text-neutral-900">
                            <div>
                                <User className="w-7 h-7" />
                            </div>
                            <div className="font-semibold">Edit Profil</div>
                        </Link>
                    </HighlightItem>

                    {/* Menu Log Out */}
                    <HighlightItem>
                        <button 
                            onClick={onLogout} 
                            className="flex w-full cursor-pointer space-x-3 items-center px-3 py-2.5 text-red-500 hover:bg-red-50 rounded-md transition-colors"
                        >
                            <div>
                                <Logout className="w-7 h-7" />
                            </div>
                            <div className="font-semibold">Log Out</div>
                        </button>
                    </HighlightItem>

                </Highlight>
            </PopoverPanel>
        </BasePopover>
    )
}