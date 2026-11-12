'use client'

import { useState } from 'react'
import { toast } from 'sonner'

import OutlineButton from '@/components/buttons/outline'
import { downloadErrorMessage, downloadFile } from '@/lib/download'

type Props = {
    /** API path of the export, e.g. `/report/gaji/export`. */
    endpoint: string
    /** The same filters as the table on screen. */
    params: Record<string, unknown>
    /** Used when the server's file name cannot be read. */
    filename: string
    formats?: ('pdf' | 'xlsx')[]
}

const LABEL = { pdf: 'Unduh PDF', xlsx: 'Unduh Excel' } as const

/** "Unduh PDF" / "Unduh Excel" for a report, with the screen's filters. */
export default function DownloadButtons({ endpoint, params, filename, formats = ['pdf', 'xlsx'] }: Props) {
    const [busy, setBusy] = useState<string | null>(null)

    const download = async (format: 'pdf' | 'xlsx') => {
        setBusy(format)
        try {
            await downloadFile(endpoint, { ...params, format }, `${filename}.${format}`)
        } catch (error) {
            toast.error(await downloadErrorMessage(error))
        } finally {
            setBusy(null)
        }
    }

    return (
        <div className="flex flex-wrap items-center gap-2">
            {formats.map((format) => (
                <OutlineButton
                    key={format}
                    type="button"
                    buttonType="secondary"
                    className="text-xs"
                    onClick={() => download(format)}
                    isLoading={busy === format}
                    disabled={busy !== null}
                >
                    {LABEL[format]}
                </OutlineButton>
            ))}
        </div>
    )
}
