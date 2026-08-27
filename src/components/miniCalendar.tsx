'use client'

import { useMemo, useState } from 'react'
import moment from 'moment'

import { Card } from '@/components/ui/card'
import { ChevronLeft, ChevronRight } from '@/components/icons/outline'
import { useJadwal } from '@/hooks/repositories/use-jadwal'
import { MONTHS } from '@/lib/format'
import { cn } from '@/lib/utils'
import type { Jadwal } from '@/lib/types'

const DAY_NAMES = ['Sen', 'Sel', 'Rab', 'Kam', 'Jum', 'Sab', 'Min']

type Props = {
    selectedDate?: Date
    /** Selecting a day used to do nothing; it now drives the schedule panel. */
    onSelectDate?: (date: Date) => void
}

export default function MiniCalendar({ selectedDate, onSelectDate }: Props) {
    const [cursor, setCursor] = useState(selectedDate ?? new Date())
    const [internalSelected, setInternalSelected] = useState(selectedDate ?? new Date())

    const selected = selectedDate ?? internalSelected
    const year = cursor.getFullYear()
    const month = cursor.getMonth()

    // Dot markers for days that actually have a jadwal.
    const { data } = useJadwal({
        from: moment([year, month, 1]).format('YYYY-MM-DD'),
        to: moment([year, month, 1]).endOf('month').format('YYYY-MM-DD'),
        paginate: false,
    })

    const daysWithEvents = useMemo(() => {
        const rows = (data as unknown as Jadwal[] | undefined) ?? []
        return new Set(rows.map((row) => moment(row.tanggal as unknown as string).format('YYYY-MM-DD')))
    }, [data])

    const daysInMonth = new Date(year, month + 1, 0).getDate()
    const daysInPrevMonth = new Date(year, month, 0).getDate()
    const jsFirstDay = new Date(year, month, 1).getDay()
    const firstDay = jsFirstDay === 0 ? 6 : jsFirstDay - 1 // Monday-first

    const prevMonthDays = Array.from({ length: firstDay }, (_, i) => daysInPrevMonth - firstDay + 1 + i)
    const currentMonthDays = Array.from({ length: daysInMonth }, (_, i) => i + 1)
    const nextMonthDays = Array.from(
        { length: Math.max(0, 42 - (prevMonthDays.length + currentMonthDays.length)) },
        (_, i) => i + 1
    )

    const isSameDay = (day: number, other: Date) =>
        day === other.getDate() && month === other.getMonth() && year === other.getFullYear()

    const handleSelect = (day: number) => {
        const next = new Date(year, month, day)
        setInternalSelected(next)
        onSelectDate?.(next)
    }

    return (
        <Card className="w-full h-full flex flex-col">
            <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl font-semibold">{MONTHS[month]} {year}</h2>
                <div className="flex gap-1">
                    <button
                        type="button"
                        onClick={() => setCursor(new Date(year, month - 1, 1))}
                        aria-label="Bulan sebelumnya"
                        className="flex p-1 items-center justify-center bg-sky-500 hover:bg-sky-400 text-white rounded-lg transition-colors"
                    >
                        <ChevronLeft className="w-5 h-5" />
                    </button>
                    <button
                        type="button"
                        onClick={() => setCursor(new Date(year, month + 1, 1))}
                        aria-label="Bulan berikutnya"
                        className="flex p-1 items-center justify-center bg-sky-500 hover:bg-sky-400 text-white rounded-lg transition-colors"
                    >
                        <ChevronRight className="w-5 h-5" />
                    </button>
                </div>
            </div>

            <div className="grid grid-cols-7 mb-2 text-center">
                {DAY_NAMES.map((day) => (
                    <div key={day} className="text-xs font-semibold text-neutral-500">{day}</div>
                ))}
            </div>

            <div className="grid grid-cols-7 text-center gap-y-1">
                {prevMonthDays.map((day) => (
                    <div key={`prev-${day}`} className="text-xs text-neutral-300 py-2">{day}</div>
                ))}

                {currentMonthDays.map((day) => {
                    const isSelected = isSameDay(day, selected)
                    const isToday = isSameDay(day, new Date())
                    const hasEvent = daysWithEvents.has(moment([year, month, day]).format('YYYY-MM-DD'))

                    return (
                        <div key={`curr-${day}`} className="flex flex-col items-center">
                            <button
                                type="button"
                                onClick={() => handleSelect(day)}
                                className={cn(
                                    // One radius, not rounded-full and rounded-sm fighting each other.
                                    'w-8 h-8 flex items-center justify-center rounded-lg text-xs transition-colors',
                                    isSelected
                                        ? 'bg-sky-500 text-white font-semibold'
                                        : isToday
                                            ? 'text-sky-600 font-semibold hover:bg-sky-50'
                                            : 'text-neutral-600 hover:bg-neutral-100'
                                )}
                            >
                                {day}
                            </button>
                            <span
                                className={cn(
                                    'mt-0.5 h-1 w-1 rounded-full',
                                    hasEvent && !isSelected ? 'bg-sky-400' : 'bg-transparent'
                                )}
                            />
                        </div>
                    )
                })}

                {nextMonthDays.map((day) => (
                    <div key={`next-${day}`} className="text-xs text-neutral-300 py-2">{day}</div>
                ))}
            </div>
        </Card>
    )
}
