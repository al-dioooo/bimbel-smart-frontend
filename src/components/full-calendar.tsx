"use client";
import { useState, useMemo } from 'react';
import { ChevronLeft, ChevronRight } from '@/components/icons/outline';

export interface CalendarEvent {
    id: string;
    title: string;
}

interface DayData {
    date: string;
    events: CalendarEvent[];
}

// ICON
const InfoIcon = ({ className }: { className?: string }) => (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className={className}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M11.25 11.25l.041-.02a.75.75 0 011.063.852l-.708 2.836a.75.75 0 001.063.853l.041-.021M21 12a9 9 0 11-18 0 9 9 0 0118 0zm-9-3.75h.008v.008H12V8.25z" />
    </svg>
);

export default function FullCalendar() {
    const [currentDate, setCurrentDate] = useState(new Date());
    const [selectedDate, setSelectedDate] = useState<Date>(new Date());
    const year = currentDate.getFullYear();
    const month = currentDate.getMonth();

    // MOCK DATA
    const mockData: DayData[] = useMemo(() => {
        const monthStr = (month + 1).toString().padStart(2, '0');
        return [
            {
                date: `${year}-${monthStr}-01`,
                events: [
                    { id: 'e1', title: 'Kelas 5 A' },
                    { id: 'e2', title: 'Kelas 8 A' }]
            },
            {
                date: `${year}-${monthStr}-02`,
                events: [
                    { id: 'e3', title: 'Kelas 6 B' },
                    { id: 'e4', title: 'Kelas 8 B' },
                    { id: 'e5', title: 'Kelas 7 A' },
                    { id: 'e5', title: 'Kelas 7 A' },
                    { id: 'e5', title: 'Kelas 7 A' }
                ]
            },
            {
                date: `${year}-${monthStr}-21`,
                events: [
                    { id: 'e3', title: 'Kelas 6 B' },
                    { id: 'e4', title: 'Kelas 8 B' }
                ]
            },
        ];
    }, [year, month]);


    // CALENDAR LOGIC
    const monthNames = [
        "Januari", "Februari", "Maret", "April", "Mei", "Juni",
        "Juli", "Agustus", "September", "Oktober", "November", "Desember"
    ];
    const dayNames = ["Senin", "Selasa", "Rabu", "Kamis", "Jumat", "Sabtu", "Minggu"];

    const getDaysInMonth = (year: number, month: number) => new Date(year, month + 1, 0).getDate();
    const getFirstDayOfMonth = (year: number, month: number) => {
        const day = new Date(year, month, 1).getDay();
        return day === 0 ? 6 : day - 1;
    };

    const daysInMonth = getDaysInMonth(year, month);
    const firstDay = getFirstDayOfMonth(year, month);

    const prevMonthDays = [];
    const daysInPrevMonth = getDaysInMonth(year, month - 1);
    for (let i = firstDay - 1; i >= 0; i--) {
        prevMonthDays.push(daysInPrevMonth - i);
    }

    const currentMonthDays = [];
    for (let i = 1; i <= daysInMonth; i++) {
        currentMonthDays.push(i);
    }

    const nextMonthDays = [];
    const totalSlots = 42;
    const remainingSlots = totalSlots - (prevMonthDays.length + currentMonthDays.length);
    for (let i = 1; i <= remainingSlots; i++) {
        nextMonthDays.push(i);
    }

    // NAVIGATION HANDLERS
    const handlePrevMonth = () => setCurrentDate(new Date(year, month - 1, 1));
    const handleNextMonth = () => setCurrentDate(new Date(year, month + 1, 1));

    // SELECTION HELPERS

    // 1. Handle Date Click
    const handleDateClick = (day: number, monthOffset: number = 0) => {
        const newDate = new Date(year, month + monthOffset, day);
        setSelectedDate(newDate);

        if (monthOffset !== 0) {
            setCurrentDate(new Date(year, month + monthOffset, 1));
        }
    };

    // 2. Check if a specific day is the one currently selected
    const isSelected = (day: number, monthOffset: number = 0) => {
        const targetDate = new Date(year, month + monthOffset, day);
        return (
            targetDate.getDate() === selectedDate.getDate() &&
            targetDate.getMonth() === selectedDate.getMonth() &&
            targetDate.getFullYear() === selectedDate.getFullYear()
        );
    };

    // 3. Check if today
    const isToday = (day: number, monthOffset: number = 0) => {
        const today = new Date();
        const targetDate = new Date(year, month + monthOffset, day);
        return (
            targetDate.getDate() === today.getDate() &&
            targetDate.getMonth() === today.getMonth() &&
            targetDate.getFullYear() === today.getFullYear()
        );
    };

    // --- Data Retrieval Helper ---
    const getEventsForDay = (day: number, currentMonthOffset: number = 0) => {
        const targetDate = new Date(year, month + currentMonthOffset, day);
        const dateStr = `${targetDate.getFullYear()}-${(targetDate.getMonth() + 1).toString().padStart(2, '0')}-${targetDate.getDate().toString().padStart(2, '0')}`;

        const dayData = mockData.find(d => d.date === dateStr);
        return dayData ? dayData.events : [];
    };

    // Shared Cell Styling
    const cellBaseClasses = "min-h-[120px] max-h-[120px] overflow-hidden flex flex-col items-start justify-start cursor-pointer transition-all duration-200";

    return (
        <div className="bg-white w-full p-6 border border-neutral-300 rounded-xl flex flex-col h-full">
            {/* Header */}
            <div className="flex justify-between items-center mb-6">
                <div className="flex items-center gap-4">
                    <div className="flex gap-1">
                        <button onClick={handlePrevMonth} className="p-1 bg-sky-500 hover:scale-110 text-white rounded-md transition">
                            <ChevronLeft className='w-5 h-5' />
                        </button>
                        <button onClick={handleNextMonth} className="p-1 bg-sky-500 hover:scale-110 text-white rounded-md transition">
                            <ChevronRight className='w-5 h-5' />
                        </button>
                    </div>
                    <h2 className="text-xl font-semibold text-black">
                        {monthNames[month]} {year}
                    </h2>
                </div>

                <button className="flex items-center gap-2 px-4 py-2 text-sky-500 border border-sky-500 rounded-full text-sm font-semibold">
                    <InfoIcon className="w-5 h-5" />
                    <span>Lihat Detail</span>
                </button>
            </div>

            <div className="rounded-xl overflow-hidden border border-neutral-300">
                {/* Weekday Labels */}
                <div className="grid grid-cols-7 text-center border-b border-neutral-300 bg-sky-100">
                    {dayNames.map((day) => (
                        <div key={day} className="py-3 text-sm font-semibold text-neutral-500">
                            {day}
                        </div>
                    ))}
                </div>

                {/* Calendar Grid */}
                <div className="grid grid-cols-7 bg-neutral-300 gap-[1px]">
                    {/* Previous Month Days */}
                    {prevMonthDays.map((day) => {
                        const events = getEventsForDay(day, -1);
                        return (
                            <div
                                key={`prev-${day}`}
                                onClick={() => handleDateClick(day, -1)}
                                className={`${cellBaseClasses} text-neutral-300 bg-neutral-100 hover:bg-sky-50 `}
                            >
                                <span className="pl-2 pt-2 text-sm font-medium">{day}</span>
                                <div className="px-2 pb-2 flex flex-col gap-1 mt-2 w-full">
                                    {events.map(event => (
                                        <div key={event.id} className="bg-neutral-200 text-neutral-500 text-[10px] px-2 py-1 rounded-md truncate">
                                            {event.title}
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )
                    })}

                    {/* Current Month Days */}
                    {currentMonthDays.map((day) => {
                        const today = isToday(day);
                        const selected = isSelected(day);
                        const events = getEventsForDay(day);

                        return (
                            <div key={`curr-${day}`} onClick={() => handleDateClick(day)} className={`${cellBaseClasses} ${selected ? 'bg-sky-100 hover:bg-sky-100' : (today ? 'bg-sky-50 hover:bg-sky-50' : 'bg-white hover:bg-sky-50')}`}>
                                <span className={`text-sm font-medium pl-2 pt-2 ${today ? 'text-sky-500' : (selected ? 'text-black' : 'text-neutral-300')}`}>
                                    {day}
                                </span>

                                <div className="px-2 pb-2 space-y-1 mt-2 w-full overflow-y-auto">
                                    {events.map(event => (
                                        <div key={event.id} className="bg-linear-to-r from-sky-200 to-sky-50 text-sky-500 text-[10px] font-semibold px-3 py-1.5 rounded-full truncate w-full text-left" title={event.title}>
                                            {event.title}
                                        </div>
                                    ))}
                                </div>
                            </div>
                        );
                    })}

                    {/* Next Month Days */}
                    {nextMonthDays.map((day) => {
                        const events = getEventsForDay(day, 1);
                        const selected = isSelected(day, 1);
                        return (
                            <div
                                key={`next-${day}`}
                                onClick={() => handleDateClick(day, 1)}
                                className={`${cellBaseClasses} text-neutral-300 bg-neutral-100 hover:bg-sky-50 
                            ${selected ? 'ring-2 ring-inset ring-sky-500 z-10' : ''}`}
                            >
                                <span className="text-sm font-medium pl-2 pt-2">{day}</span>
                                <div className="px-2 pb-2 flex flex-col gap-1 mt-2 w-full">
                                    {events.map(event => (
                                        <div key={event.id} className="bg-neutral-200 text-neutral-500 text-[10px] px-2 py-1 rounded-md truncate">
                                            {event.title}
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )
                    })}
                </div>
            </div>
        </div>
    );
}