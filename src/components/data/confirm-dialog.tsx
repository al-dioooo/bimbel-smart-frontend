'use client'

import { useState } from 'react'

import Modal from '@/components/modal'
import PrimaryButton from '@/components/buttons/primary'
import OutlineButton from '@/components/buttons/outline'

type Props = {
    isOpen: boolean
    onClose: () => void
    onConfirm: () => void | Promise<void>

    title: string
    message: React.ReactNode
    confirmLabel?: string
    cancelLabel?: string
    tone?: 'danger' | 'default'
}

/** Confirmation gate for destructive actions — every Delete goes through this. */
export default function ConfirmDialog({
    isOpen,
    onClose,
    onConfirm,
    title,
    message,
    confirmLabel = 'Hapus',
    cancelLabel = 'Batal',
    tone = 'danger',
}: Props) {
    const [isSubmitting, setIsSubmitting] = useState(false)

    const handleConfirm = async () => {
        setIsSubmitting(true)
        try {
            await onConfirm()
            onClose()
        } finally {
            setIsSubmitting(false)
        }
    }

    return (
        <Modal from="top" size="md" isOpen={isOpen} onClose={onClose} title={title}>
            <div className="mt-2 text-sm text-neutral-600">{message}</div>

            <div className="mt-6 flex items-center justify-end gap-2 text-sm">
                <OutlineButton type="button" buttonType="secondary" onClick={onClose} disabled={isSubmitting}>
                    {cancelLabel}
                </OutlineButton>
                {tone === 'danger' ? (
                    <OutlineButton
                        type="button"
                        buttonType="danger"
                        onClick={handleConfirm}
                        isLoading={isSubmitting}
                        disabled={isSubmitting}
                    >
                        {confirmLabel}
                    </OutlineButton>
                ) : (
                    <PrimaryButton
                        type="button"
                        onClick={handleConfirm}
                        isLoading={isSubmitting}
                        disabled={isSubmitting}
                    >
                        {confirmLabel}
                    </PrimaryButton>
                )}
            </div>
        </Modal>
    )
}
