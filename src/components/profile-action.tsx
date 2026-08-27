'use client'

import { Popover as BasePopover, PopoverButton, PopoverPanel } from "@/components/base/popover"
import { Highlight, HighlightItem } from "@/components/base/highlight"
import Link from "next/link"
import { User, Logout, ChevronDown } from "@/components/icons/outline"
import { useUser } from "@/hooks/use-user"

type Props = {
    biodataLink?: string
    onLogout?: () => void
    children?: React.ReactNode
}

export default function ProfileAction({
    biodataLink = "/edit-profil",
    onLogout,
    children
}: Props) {
    const { user, isLoading } = useUser()

    return (
        <BasePopover>
            <PopoverButton className="flex items-center group cursor-pointer focus:outline-none">
                {children ? (
                    children
                ) : (
                    <div className="flex items-center space-x-4">
                        <div className="flex items-center space-x-2">
                            <div className="p-2 group-hover:from-sky-400 group-hover:to-sky-200 transition rounded-xl bg-radial-[at_20%_20%] from-sky-500 to-sky-300">
                                <User className="text-white w-6 h-6" />
                            </div>
                            <div className="text-left group-hover:text-neutral-500 transition">
                                {/* Don't assert a name or role before /me resolves — this
                                    used to render an empty name labelled "Mentor". */}
                                {isLoading || !user ? (
                                    <>
                                        <div className="h-3.5 w-24 rounded bg-neutral-100 animate-pulse" />
                                        <div className="mt-1 h-3 w-16 rounded bg-neutral-100 animate-pulse" />
                                    </>
                                ) : (
                                    <>
                                        <p className="text-sm font-medium">{user.name}</p>
                                        <p className="text-xs text-neutral-500">
                                            {user.role === 1 ? 'Administrator' : 'Mentor'}
                                        </p>
                                    </>
                                )}
                            </div>
                        </div>

                        <ChevronDown strokeWidth={2} className="w-4 h-4 group-hover:text-neutral-500 transition" />
                    </div>
                )}
            </PopoverButton>

            {/* Panel Menu */}
            <PopoverPanel anchor={{ to: "bottom end", gap: 8 }} className="w-48 bg-background border p-1 z-50 rounded-xl text-sm shadow-md">
                <Highlight hover controlledItems className="bg-neutral-100 rounded-lg inset-0 space-y-1">

                    {/* Menu Biodata */}
                    <HighlightItem>
                        <Link href={biodataLink} className="flex space-x-3 items-center px-3 py-2.5 text-neutral-900">
                            <div>
                                <User className="w-5 h-5" />
                            </div>
                            <div>Edit Profil</div>
                        </Link>
                    </HighlightItem>

                    {/* Menu Log Out */}
                    <HighlightItem>
                        <button onClick={onLogout} className="flex w-full cursor-pointer space-x-3 items-center px-3 py-2.5 text-red-500 hover:bg-red-50 rounded-md transition-colors">
                            <div>
                                <Logout className="w-5 h-5" />
                            </div>
                            <div>Log Out</div>
                        </button>
                    </HighlightItem>

                </Highlight>
            </PopoverPanel>
        </BasePopover>
    )
}