'use client'

import moment from 'moment'
import { useMemo } from 'react'
import Link from 'next/link'

import { Card, CardHeader } from '@/components/ui/card'
import { useJadwal } from '@/hooks/repositories/use-jadwal'
import { formatTimeRange } from '@/lib/format'
import type { Jadwal } from '@/lib/types'

type Props = {
    /** Anchors the window; defaults to today. */
    date?: Date
    /** How many days forward to show. */
    days?: number
    title?: string
}

export default function JadwalDashboard({ date, days = 7, title = 'Jadwal' }: Props) {
    const anchor = date ?? new Date()
    const from = moment(anchor).format('YYYY-MM-DD')
    const to = moment(anchor).add(days, 'days').format('YYYY-MM-DD')

    // Was `mockScheduleData`, with the real fetch left commented out.
    const { data, isLoading, error } = useJadwal({ from, to, paginate: false, order_by: 'tanggal', direction: 'asc' })

    const grouped = useMemo(() => {
        const rows = (data as unknown as Jadwal[] | undefined) ?? []
        const buckets = new Map<string, Jadwal[]>()

        rows.forEach((row) => {
            const key = moment(row.tanggal as unknown as string).format('YYYY-MM-DD')
            buckets.set(key, [...(buckets.get(key) ?? []), row])
        })

        return Array.from(buckets.entries())
            .sort(([a], [b]) => a.localeCompare(b))
            .map(([day, events]) => ({ day, events }))
    }, [data])

    return (
        <Card className="w-full h-full flex flex-col">
            <CardHeader
                title={title}
                aside={
                    <Link href="/jadwal/list" className="text-xs font-semibold text-sky-500 hover:text-sky-600">
                        Lihat semua
                    </Link>
                }
            />

            <div className="mt-6 flex flex-col gap-6 overflow-y-auto">
                {error ? (
                    <p className="py-10 text-center text-sm text-red-500">Gagal memuat jadwal</p>
                ) : isLoading ? (
                    Array.from({ length: 2 }).map((_, i) => (
                        <div key={i} className="space-y-3">
                            <div className="h-3 w-24 rounded bg-neutral-100 animate-pulse" />
                            <div className="h-4 w-3/4 rounded bg-neutral-100 animate-pulse" />
                            <div className="h-4 w-1/2 rounded bg-neutral-100 animate-pulse" />
                        </div>
                    ))
                ) : grouped.length === 0 ? (
                    <p className="py-10 text-center text-sm text-neutral-400">Tidak ada jadwal pada periode ini</p>
                ) : (
                    grouped.map(({ day, events }) => (
                        <div key={day}>
                            <div className="flex items-center mb-4">
                                <h3 className="text-sm font-semibold text-neutral-900 whitespace-nowrap mr-4">
                                    {moment(day).format('D MMMM')}
                                </h3>
                                <div className="h-px bg-neutral-200 w-full" />
                            </div>

                            <div className="flex flex-col gap-5">
                                {events.map((event) => (
                                    <div key={event.id} className="flex flex-col gap-1">
                                        <p className="text-sm font-semibold text-neutral-400 uppercase truncate">
                                            {event.kelas?.mentor?.user?.name ?? 'Tanpa mentor'}
                                        </p>

                                        <div className="flex items-center gap-3">
                                            <span className="text-sm font-semibold text-neutral-500">
                                                {formatTimeRange(event.waktu_mulai, event.waktu_selesai)}
                                            </span>
                                            <span className="w-px h-4 bg-neutral-300" />
                                            <span className="text-sm font-bold text-neutral-900">
                                                {event.kelas?.nama ?? '-'}
                                            </span>
                                        </div>

                                        {event.materi && (
                                            <p className="text-xs text-neutral-500 truncate">{event.materi}</p>
                                        )}
                                    </div>
                                ))}
                            </div>
                        </div>
                    ))
                )}
            </div>
        </Card>
    )
}
