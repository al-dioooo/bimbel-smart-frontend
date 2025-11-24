'use client'

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
import { Search, X } from '@/components/icons/outline'
import { useEffect, useState } from 'react'

type Props = {
    isOpen: boolean
    onClose: () => void

    from: DialogFlipDirection

    children: React.ReactNode
    title: string
    subtitle?: string

    footer?: React.ReactNode
}

export default function Modal({ isOpen = false, onClose, from, children, title, subtitle, footer }: Props) {
    const [isOpenState, setIsOpenState] = useState(isOpen)

    useEffect(() => {
        setIsOpenState(isOpen)
    }, [isOpen])

    return (
        <Dialog open={isOpenState} onClose={onClose}>
            <DialogBackdrop className="fixed inset-0 z-50 bg-black/80" />
            <DialogPanel from={from} className="sm:max-w-lg min-w-lg fixed left-[50%] top-[50%] translate-x-[-50%] translate-y-[-50%] z-50 border bg-background p-4 rounded-3xl">
                <DialogHeader>
                    <DialogTitle className="text-xl font-semibold">{title}</DialogTitle>
                    <DialogDescription className="text-sm">
                        {subtitle}
                    </DialogDescription>
                </DialogHeader>

                <div>
                    {children}
                </div>

                <DialogFooter>
                    {footer}
                </DialogFooter>

                <DialogClose className="absolute top-4 right-4">
                    <span className="p-2 flex bg-neutral-100 rounded-lg cursor-pointer">
                        <X className="w-4 h-4" />
                    </span>
                    <span className="sr-only">Close</span>
                </DialogClose>
            </DialogPanel>
        </Dialog>
    )
}