'use client'

import * as React from 'react'
import {
    Dialog,
    DialogBackdrop,
    DialogClose,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogPanel,
    DialogTitle,
    type DialogFlipDirection,
} from '@/components/base/dialog'
import { Search } from '@/components/icons/outline'

type RadixDialogDemoProps = {
    from: DialogFlipDirection
}

export default function GlobalSearch({ from }: RadixDialogDemoProps) {
    const [isOpen, setIsOpen] = React.useState(false)

    return (
        <div>
            <button onClick={() => setIsOpen(true)} className="inline-flex cursor-pointer rounded-xl justify-center border border-neutral-200 bg-white/80 px-6 py-3 w-full focus:outline-none">
                <div className="inline-flex items-center space-x-2">
                    <span>
                        <Search className="w-4 h-4" />
                    </span>
                    <span className="text-xs">Cari apa saja</span>
                </div>
            </button>

            <Dialog open={isOpen} onClose={() => setIsOpen(false)}>
                <DialogBackdrop className="fixed inset-0 z-50 bg-black/80" />
                <DialogPanel from={from} className="sm:max-w-md min-w-md fixed left-[50%] top-[50%] translate-x-[-50%] translate-y-[-50%] z-50">
                    <div className="inline-flex rounded-xl border border-neutral-200 bg-white/95 w-full">
                        <div className="flex w-full items-center space-x-2">
                            <span className="pl-4">
                                <Search className="w-6 h-6" />
                            </span>
                            <input className="pr-6 py-3 w-full focus:outline-none" placeholder="Search Anything" />
                        </div>
                    </div>

                    {/* <DialogFooter>
                        <button className="bg-primary text-primary-foreground px-4 py-2 text-sm">
                            Accept
                        </button>
                    </DialogFooter> */}

                    <DialogClose className="absolute top-3 right-1">
                        <span className="uppercase tracking-widest font-medium border rounded-xl px-4 py-2 text-xs">ESC</span>
                    </DialogClose>
                </DialogPanel>
            </Dialog>
        </div>
    )
}