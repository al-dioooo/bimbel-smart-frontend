"use client"

import { useEffect, useState } from "react"
import moment from "moment"

import { Calendar } from "@/components/ui/calendar"
import { Popover, PopoverButton, PopoverPanel } from "@/components/base/popover"
import { CalendarEvent } from "@/components/icons/outline"

type Props = {
    value?: Date
    onChange: (value: Date | undefined) => void
    placeholder?: string
}

export default function InputDate({ value, onChange, placeholder = "Pilih tanggal" }: Props) {
    const [date, setDate] = useState<Date | undefined>(value)
    const [month, setMonth] = useState<Date | undefined>(value)

    useEffect(() => {
        setDate(value)
        if (value) setMonth(value)
    }, [value])

    const updateValue = (next: Date | undefined) => {
        setDate(next)
        onChange(next)
    }

    return (
        <Popover>
            <PopoverButton
                id="date-picker"
                className="p-2 mt-1 w-full border-neutral-200 text-sm text-left transition border focus:outline-none rounded-xl cursor-pointer focus:border-sky-400 focus:ring-2 focus:ring-sky-200 relative"
            >
                <span className={date ? "text-neutral-900" : "text-neutral-400"}>
                    {date ? moment(date).format("D MMMM YYYY") : placeholder}
                </span>
                <span className="absolute inset-y-0 right-0 flex items-center pr-2 pointer-events-none">
                    <CalendarEvent className="w-5 h-5 text-neutral-400" />
                </span>
            </PopoverButton>
            <PopoverPanel anchor={{ to: "bottom end", gap: 4 }} className="bg-white border border-neutral-200 shadow-lg z-50 rounded-xl text-xs">
                <Calendar
                    mode="single"
                    selected={date}
                    captionLayout="dropdown"
                    month={month}
                    onMonthChange={setMonth}
                    onSelect={updateValue}
                />
            </PopoverPanel>
        </Popover>
    )
}
