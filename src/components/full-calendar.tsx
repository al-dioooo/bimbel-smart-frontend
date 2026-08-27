'use client'

import { useMemo, useState } from 'react'
import moment from 'moment'
import { useRouter } from 'next/navigation'

import { ChevronLeft, ChevronRight, InfoCircle } from '@/components/icons/outline'
import OutlineButton from '@/components/buttons/outline'
import { useJadwal } from '@/hooks/repositories/use-jadwal'
import { MONTHS, formatTime } from '@/lib/format'
import { cn } from '@/lib/utils'
import type { Jadwal } from '@/lib/types'

const DAY_NAMES = ['Senin', 'Selasa', 'Rabu', 'Kamis', 'Jumat', 'Sabtu', 'Minggu']

type Props = {
    selectedDate?: Date
    onSelectDate?: (date: Date) => void
}

export default function FullCalendar({ selectedDate, onSelectDate }: Props) {
    const router = useRouter()

    const [cursor, setCursor] = useState(selectedDate ?? new Date())
    const [internalSelected, setInternalSelected] = useState(selectedDate ?? new Date())

    const selected = selectedDate ?? internalSelected
    const year = cursor.getFullYear()
    const month = cursor.getMonth()

    // Fetch the whole visible grid, so adjacent-month cells show real events too.
    const gridStart = moment([year, month, 1]).startOf('isoWeek')
    const gridEnd = gridStart.clone().add(41, 'days')

    // Was `mockData` — three invented days of placeholder classes.
    const { data, isLoading, error } = useJadwal({
        from: gridStart.format('YYYY-MM-DD'),
        to: gridEnd.format('YYYY-MM-DD'),
        paginate: false,
        order_by: 'waktu_mulai',
        direction: 'asc',
    })

    const eventsByDay = useMemo(() => {
        const rows = (data as unknown as Jadwal[] | undefined) ?? []
        const map = new Map<string, Jadwal[]>()
        rows.forEach((row) => {
            const key = moment(row.tanggal as unknown as string).format('YYYY-MM-DD')
            map.set(key, [...(map.get(key) ?? []), row])
        })
        return map
    }, [data])

    const cells = useMemo(
        () =>
            Array.from({ length: 42 }, (_, i) => {
                const date = gridStart.clone().add(i, 'days')
                return {
                    date: date.toDate(),
                    key: date.format('YYYY-MM-DD'),
                    day: date.date(),
                    isCurrentMonth: date.month() === month,
                }
            }),
        // eslint-disable-next-line react-hooks/exhaustive-deps
        [year, month]
    )

    const handleSelect = (date: Date) => {
        setInternalSelected(date)
        onSelectDate?.(date)
        if (date.getMonth() !== month) setCursor(new Date(date.getFullYear(), date.getMonth(), 1))
    }

    const isSameDay = (a: Date, b: Date) => moment(a).isSame(b, 'day')

    return (
        <div className="bg-white w-full p-6 border border-neutral-200 rounded-xl flex flex-col h-full">
            <div className="flex flex-wrap justify-between items-center gap-4 mb-6">
                <div className="flex items-center gap-4">
                    <div className="flex gap-1">
                        <button
                            type="button"
                            onClick={() => setCursor(new Date(year, month - 1, 1))}
                            aria-label="Bulan sebelumnya"
                            className="p-1 bg-sky-500 hover:bg-sky-400 text-white rounded-lg transition-colors"
                        >
                            <ChevronLeft className="w-5 h-5" />
                        </button>
                        <button
                            type="button"
                            onClick={() => setCursor(new Date(year, month + 1, 1))}
                            aria-label="Bulan berikutnya"
                            className="p-1 bg-sky-500 hover:bg-sky-400 text-white rounded-lg transition-colors"
                        >
                            <ChevronRight className="w-5 h-5" />
                        </button>
                    </div>
                    <h2 className="text-xl font-semibold text-neutral-900">{MONTHS[month]} {year}</h2>
                    {isLoading && <span className="text-xs text-neutral-400">Memuat…</span>}
                    {!!error && <span className="text-xs text-red-500">Gagal memuat jadwal</span>}
                </div>

                {/* This button previously had no handler at all. */}
                <OutlineButton
                    type="button"
                    className="text-sm"
                    icon={<InfoCircle className="w-5 h-5" />}
                    onClick={() => router.push(`/jadwal/list?from=${moment(selected).format('YYYY-MM-DD')}&to=${moment(selected).format('YYYY-MM-DD')}`)}
                >
                    Lihat Detail
                </OutlineButton>
            </div>

            <div className="rounded-xl overflow-hidden border border-neutral-200">
                <div className="grid grid-cols-7 text-center border-b border-neutral-200 bg-sky-50">
                    {DAY_NAMES.map((day) => (
                        <div key={day} className="py-3 text-sm font-semibold text-neutral-600">{day}</div>
                    ))}
                </div>

                <div className="grid grid-cols-7 bg-neutral-200 gap-px">
                    {cells.map((cell) => {
                        const events = eventsByDay.get(cell.key) ?? []
                        const isSelected = isSameDay(cell.date, selected)
                        const isToday = isSameDay(cell.date, new Date())

                        return (
                            <button
                                type="button"
                                key={cell.key}
                                onClick={() => handleSelect(cell.date)}
                                className={cn(
                                    'min-h-[130px] max-h-[130px] overflow-hidden flex flex-col items-start text-left cursor-pointer transition-colors',
                                    cell.isCurrentMonth
                                        ? isSelected
                                            ? 'bg-sky-100'
                                            : isToday
                                                ? 'bg-sky-50'
                                                : 'bg-white hover:bg-sky-50'
                                        : 'bg-neutral-50 hover:bg-neutral-100'
                                )}
                            >
                                <span
                                    className={cn(
                                        'text-sm font-medium pl-2 pt-2',
                                        // Current-month numbers used to be neutral-300 —
                                        // identical to the greyed-out adjacent months.
                                        !cell.isCurrentMonth
                                            ? 'text-neutral-400'
                                            : isToday
                                                ? 'text-sky-600 font-bold'
                                                : 'text-neutral-800'
                                    )}
                                >
                                    {cell.day}
                                </span>

                                <div className="px-2 pb-2 pt-1 space-y-1 w-full overflow-y-auto">
                                    {events.map((event) => (
                                        <div
                                            key={event.id}
                                            title={`${formatTime(event.waktu_mulai)} ${event.kelas?.nama ?? ''}`}
                                            className={cn(
                                                'text-[10px] font-semibold px-2 py-1 rounded-full truncate w-full',
                                                cell.isCurrentMonth
                                                    ? 'bg-linear-to-r from-sky-200 to-sky-50 text-sky-600'
                                                    : 'bg-neutral-200 text-neutral-500'
                                            )}
                                        >
                                            {formatTime(event.waktu_mulai)} · {event.kelas?.nama ?? '-'}
                                        </div>
                                    ))}
                                </div>
                            </button>
                        )
                    })}
                </div>
            </div>
        </div>
    )
}
