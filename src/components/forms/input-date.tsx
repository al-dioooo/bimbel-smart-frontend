"use client"

import { useEffect, useState } from "react"
import { CalendarIcon, ChevronsUpDown } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Calendar } from "@/components/ui/calendar"
import Input from "@/components/forms/input"
import Label from "@/components/forms/label"
import {
    Popover,
    PopoverButton,
    PopoverPanel
} from "@/components/base/popover"
import { CalendarEvent } from "../icons/outline"
import moment from "moment"

function formatDate(date: Date | undefined) {
    if (!date) {
        return ""
    }

    return moment(date).format('Y-MM-DD')
}

function isValidDate(date: Date | undefined) {
    if (!date) {
        return false
    }
    return !isNaN(date.getTime())
}

type Props = {
    value?: Date
    onChange: (value: Date | string | undefined) => void
}

export default function InputDate({ value, onChange }: Props) {
    const [open, setOpen] = useState(false)
    const [date, setDate] = useState<Date | undefined>(value)
    const [month, setMonth] = useState<Date | undefined>(value)
    const [inputValue, setInputValue] = useState(formatDate(date))

    // useEffect(() => {
    //     if (inputValue) {
    //         setDate(new Date(inputValue))
    //         console.log("inputValue", inputValue)
    //         console.log("inputValue Date", new Date(inputValue))
    //         console.log("inputValue Formatted", moment(inputValue).format('Y-MM-DD'))
    //     }
    // }, [inputValue])

    useEffect(() => {
        if (value) {
            setDate(value)
        }
    }, [value])

    const updateValue = (date: Date | undefined) => {
        setDate(date)
        setInputValue(formatDate(date))

        onChange(date)
    }

    return (
        <Popover>
            <PopoverButton id="date-picker" className="p-2 mt-1 w-full border-neutral-200 text-sm text-left transition border focus:outline-none rounded-xl cursor-pointer focus:border-sky-400 focus:ring focus:ring-sky-200 relative">
                {date ? moment(date).format('Y-MM-DD') : "Select date"}
                <span className="absolute inset-y-0 right-0 flex items-center pr-2 pointer-events-none">
                    <CalendarEvent className="w-5 h-5 text-neutral-500" />
                </span>
            </PopoverButton>
            <PopoverPanel anchor={{ to: "bottom end", gap: 4 }} className="bg-background border z-50 rounded-xl text-xs">
                <Calendar mode="single" selected={date} captionLayout="dropdown" month={month} onMonthChange={setMonth} onSelect={(date) => {
                    updateValue(date)
                    setOpen(false)
                }} />
            </PopoverPanel>
        </Popover>
    )
}
