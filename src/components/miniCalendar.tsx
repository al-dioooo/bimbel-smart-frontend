"use client";

import { useState } from 'react';
import { ChevronLeft, ChevronRight } from '@/components/icons/outline';

export default function MiniCalendar() {
    const [currentDate, setCurrentDate] = useState(new Date());
    const [selectedDate, setSelectedDate] = useState(new Date());

    const year = currentDate.getFullYear();
    const month = currentDate.getMonth();

    // Bulan
    const monthNames = [
        "Januari", "Februari", "Maret", "April", "Mei", "Juni",
        "Juli", "Agustus", "September", "Oktober", "November", "Desember"
    ];

    // Hari
    const dayNames = ["Sen", "Sel", "Rab", "Kam", "Jum", "Sab", "Min"];

    // Helper to get days in a month
    const getDaysInMonth = (year: number, month: number) => {
        return new Date(year, month + 1, 0).getDate();
    };

    // Helper to get the day of the week for the 1st of the month (0=Mon, 6=Sun adjustment)
    const getFirstDayOfMonth = (year: number, month: number) => {
        const day = new Date(year, month, 1).getDay();
        // JS returns 0 for Sunday, but we want Monday start. 
        // Convert: Sun(0)->6, Mon(1)->0, Tue(2)->1 ...
        return day === 0 ? 6 : day - 1;
    };

    const daysInMonth = getDaysInMonth(year, month);
    const firstDay = getFirstDayOfMonth(year, month);
    
    // Days from previous month to fill the grid
    const prevMonthDays = [];
    const daysInPrevMonth = getDaysInMonth(year, month - 1);
    for (let i = firstDay - 1; i >= 0; i--) {
        prevMonthDays.push(daysInPrevMonth - i);
    }

    // Days for current month
    const currentMonthDays = [];
    for (let i = 1; i <= daysInMonth; i++) {
        currentMonthDays.push(i);
    }

    // Days from next month to fill the grid (total 42 cells usually covers 6 weeks)
    const nextMonthDays = [];
    const totalSlots = 42; // 6 rows * 7 cols
    const remainingSlots = totalSlots - (prevMonthDays.length + currentMonthDays.length);
    for (let i = 1; i <= remainingSlots; i++) {
        nextMonthDays.push(i);
    }

    // Navigation Handlers
    const handlePrevMonth = () => {
        setCurrentDate(new Date(year, month - 1, 1));
    };

    const handleNextMonth = () => {
        setCurrentDate(new Date(year, month + 1, 1));
    };

    // Check if a date is the selected date
    const isSelected = (day: number) => {
        return (
            day === selectedDate.getDate() &&
            month === selectedDate.getMonth() &&
            year === selectedDate.getFullYear()
        );
    };

    // Check if a date is today (for standard highlighting, though image relies on selection)
    const isToday = (day: number) => {
        const today = new Date();
        return (
            day === today.getDate() &&
            month === today.getMonth() &&
            year === today.getFullYear()
        );
    };

    return (
        <div className="bg-white rounded-xl w-full h-full p-4 border border-neutral-300 flex flex-col">
            {/* Header */}
            <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl font-semibold">
                    {monthNames[month]} {year}
                </h2>
                <div className="flex gap-1">
                    <button 
                        onClick={handlePrevMonth}
                        className="flex p-1 items-center justify-center bg-sky-500 hover:scale-110 text-white rounded-lg"
                    >
                        <ChevronLeft className='w-5 h-5' />
                    </button>
                    <button 
                        onClick={handleNextMonth}
                        className="flex p-1 items-center justify-center bg-sky-500 hover:scale-110 text-white rounded-lg"
                    >
                        <ChevronRight className='w-5 h-5' />
                    </button>
                </div>
            </div>

            {/* Weekday Labels */}
            <div className="grid grid-cols-7 mb-2 text-center">
                {dayNames.map((day) => (
                    <div key={day} className="text-xs font-semibold text-black">
                        {day}
                    </div>
                ))}
            </div>

            {/* Calendar Grid */}
            <div className="grid grid-cols-7 text-center">
                {/* Previous Month Days (Grayed out) */}
                {prevMonthDays.map((day) => (
                    <div key={`prev-${day}`} className="text-xs text-neutral-400 py-2">
                        {day}
                    </div>
                ))}

                {/* Current Month Days */}
                {currentMonthDays.map((day) => {
                    const selected = isSelected(day);
                    const today = isToday(day);
                    return (
                        <div key={`curr-${day}`} className="flex justify-center items-center">
                            <button
                                onClick={() => setSelectedDate(new Date(year, month, day))}
                                className={`
                                    w-full h-full py-2 flex items-center justify-center rounded-full text-xs
                                    ${selected 
                                        ? 'bg-neutral-200 text-xs font-semibold rounded-sm'
                                        : today 
                                            ? 'text-sky-500 font-semibold' 
                                            : 'text-neutral-500'
                                    }
                                `}
                            >
                                {day}
                            </button>
                        </div>
                    );
                })}

                {/* Next Month Days (Grayed out) */}
                {nextMonthDays.map((day) => (
                    <div key={`next-${day}`} className="text-xs text-neutral-400 py-2">
                        {day}
                    </div>
                ))}
            </div>
        </div>
    );
}