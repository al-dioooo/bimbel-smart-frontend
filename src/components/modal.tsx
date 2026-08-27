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
import { X } from '@/components/icons/outline'
import { cn } from '@/lib/utils'

type ModalSize = 'sm' | 'md' | 'lg' | 'xl' | '2xl' | '3xl'

/** Explicit map — `sm:max-w-${size}` is invisible to Tailwind's scanner. */
const sizeClasses: Record<ModalSize, string> = {
    sm: 'sm:max-w-sm',
    md: 'sm:max-w-md',
    lg: 'sm:max-w-lg',
    xl: 'sm:max-w-xl',
    '2xl': 'sm:max-w-2xl',
    '3xl': 'sm:max-w-3xl',
}

type Props = {
    isOpen: boolean
    onClose: () => void

    from: DialogFlipDirection

    children: React.ReactNode
    title: string
    subtitle?: string

    footer?: React.ReactNode

    size?: ModalSize
}

export default function Modal({ isOpen = false, onClose, from, children, title, subtitle, footer, size = 'lg' }: Props) {
    return (
        <Dialog open={isOpen} onClose={onClose}>
            <DialogBackdrop className="fixed inset-0 z-50 bg-black/60" />
            <DialogPanel
                from={from}
                className={cn(
                    'fixed left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 z-50',
                    'w-[calc(100vw-2rem)]',
                    sizeClasses[size],
                    'border border-neutral-200 bg-white p-6 rounded-2xl shadow-xl'
                )}
            >
                <DialogHeader>
                    <DialogTitle className="text-xl font-semibold pr-10">{title}</DialogTitle>
                    {subtitle && (
                        <DialogDescription className="mt-1 text-sm text-neutral-500">
                            {subtitle}
                        </DialogDescription>
                    )}
                </DialogHeader>

                <div>{children}</div>

                {footer && <DialogFooter>{footer}</DialogFooter>}

                <DialogClose className="absolute top-4 right-4">
                    <span className="p-2 flex bg-neutral-100 hover:bg-neutral-200 transition-colors rounded-lg cursor-pointer">
                        <X className="w-4 h-4" />
                    </span>
                    <span className="sr-only">Tutup</span>
                </DialogClose>
            </DialogPanel>
        </Dialog>
    )
}
