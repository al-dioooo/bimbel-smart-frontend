'use client'

import Link from 'next/link'

import { Card, CardHeader } from '@/components/ui/card'
import { usePengajuanJadwal } from '@/hooks/repositories/use-pengajuan-jadwal'
import { formatDate } from '@/lib/format'
import { normalizePengajuanStatus, pengajuanStatus, toneClasses } from '@/lib/status'
import { cn } from '@/lib/utils'

export default function PengajuanDashboard() {
    // Was nine hardcoded rows.
    const { data, isLoading, error } = usePengajuanJadwal({ limit: 8 })
    const rows = data?.data ?? []

    return (
        <Card className="w-full h-full flex flex-col">
            <CardHeader
                title="Pengajuan"
                aside={
                    <Link href="/jadwal/pengajuan" className="text-xs font-semibold text-sky-500 hover:text-sky-600">
                        Lihat semua
                    </Link>
                }
            />

            <div className="mt-4 space-y-3 overflow-y-auto">
                {error ? (
                    <p className="py-6 text-center text-xs text-red-500">Gagal memuat pengajuan</p>
                ) : isLoading ? (
                    Array.from({ length: 4 }).map((_, i) => (
                        <div key={i} className="flex items-center justify-between gap-4">
                            <div className="h-3 w-2/3 rounded bg-neutral-100 animate-pulse" />
                            <div className="h-6 w-24 rounded-full bg-neutral-100 animate-pulse" />
                        </div>
                    ))
                ) : rows.length === 0 ? (
                    <p className="py-6 text-center text-xs text-neutral-400">Tidak ada pengajuan</p>
                ) : (
                    rows.map((item) => {
                        const key = normalizePengajuanStatus(item.status)
                        const { label, tone } = pengajuanStatus[key]
                        return (
                            <div key={item.id} className="flex items-center justify-between gap-4">
                                <p className="text-xs font-medium text-neutral-700 truncate">
                                    {item.jadwal?.kelas?.nama ?? 'Jadwal'} — {formatDate(item.tanggal_sesudah)}
                                </p>
                                <span
                                    className={cn(
                                        'inline-flex shrink-0 items-center justify-center w-24 px-3 py-1 rounded-full border text-xs font-semibold',
                                        toneClasses[tone]
                                    )}
                                >
                                    {label}
                                </span>
                            </div>
                        )
                    })
                )}
            </div>
        </Card>
    )
}
