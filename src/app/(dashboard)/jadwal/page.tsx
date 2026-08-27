'use client'

import { useState } from "react"
import moment from "moment"

import Calendar from "@/components/full-calendar"
import JadwalDashboard from "@/components/jadwalDashboard"

export default function JadwalPage() {
    const [selectedDate, setSelectedDate] = useState(new Date())

    return (
        <div className="flex flex-col gap-4 xl:flex-row xl:items-stretch">
            {/* Was `pace-y-4` — a typo, so the utility never applied. */}
            <div className="space-y-4 w-full xl:w-9/12 flex flex-col">
                <div className="h-full">
                    <Calendar selectedDate={selectedDate} onSelectDate={setSelectedDate} />
                </div>
            </div>
            <div className="space-y-4 w-full xl:w-3/12 flex flex-col">
                <div className="h-full">
                    <JadwalDashboard
                        date={selectedDate}
                        days={7}
                        title={`Jadwal ${moment(selectedDate).format('D MMMM')}`}
                    />
                </div>
            </div>
        </div>
    )
}
