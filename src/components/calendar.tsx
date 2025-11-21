    'use client';
    import { useState, useEffect } from 'react';
    import { ChevronLeft, ChevronRight } from '@/components/icons/outline';

    interface CalendarEvent {
    id: string;
    title: string;
    color: 'sky';
    date: string; // Format YYYY-MM-DD
    }

    interface CalendarDay {
    dateObj: Date;       
    dayNumber: number;   
    fullDate: string;    
    isCurrentMonth: boolean;
    events: CalendarEvent[];
    }

    // --- MOCK DATA (Database Dummy) ---
    // Nanti data ini yang di-replace dengan hasil fetch API
    const mockEventsDatabase: CalendarEvent[] = [
    { id: '1', title: 'Kelas 5 A', date: '2025-10-01', color: 'sky' },
    { id: '2', title: 'Kelas 8 A', date: '2025-10-01', color: 'sky' },
    { id: '3', title: 'Kelas 6 B', date: '2025-10-02', color: 'sky' },
    { id: '4', title: 'Kelas 8 B', date: '2025-10-02', color: 'sky' },
    { id: '5', title: 'Kelas 7 A', date: '2025-10-02', color: 'sky' },
    { id: '6', title: 'Kelas 5 A', date: '2025-10-15', color: 'sky' },
    { id: '7', title: 'Kelas 9 B', date: '2025-11-01', color: 'sky' },
    ];

    // --- HELPER COMPONENTS ---
    const EventPill = ({ title, color = 'sky' }: { title: string, color?: string }) => {
    const colorClasses: Record<string, string> = {
        sky: 'bg-linear-to-r from-sky-200 to-sky-50 text-sky-500 hover:text-sky-700',
    };

    const selectedColor = colorClasses[color] || colorClasses.sky;

    return (
        <div className={`w-full px-2 py-1 rounded-full text-[10px] font-semibold cursor-pointer transition-colors truncate ${selectedColor}`}>
        {title}
        </div>
    );
    };

    // --- ICONS ---
    const DetailIcon = () => (
        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><path d="M12 16v-4"/><path d="M12 8h.01"/></svg>
    );

    // --- MAIN COMPONENT ---
    export default function Calendar() {
    const [currentDate, setCurrentDate] = useState(new Date(2025, 9, 1));
    const [calendarGrid, setCalendarGrid] = useState<CalendarDay[]>([]);

    // State Data Event (Simulasi fetch)
    const [events, setEvents] = useState<CalendarEvent[]>([]);

    // Helpers Navigasi
    const year = currentDate.getFullYear();
    const month = currentDate.getMonth();
    
    const monthNames = ["Januari", "Februari", "Maret", "April", "Mei", "Juni", "Juli", "Agustus", "September", "Oktober", "November", "Desember"];

    // --- LOGIC 1: FETCH DATA (Simulasi) ---
    useEffect(() => {
        // Di sini nanti fetch API berdasarkan bulan & tahun
        // const fetchEvents = async () => { const res = await fetch(...); setEvents(res.data); }
        
        setEvents(mockEventsDatabase);
    }, [month, year]); 

    // --- LOGIC 2: GENERATE GRID KALENDER ---
    useEffect(() => {
        const generateCalendarGrid = () => {
        const firstDayOfMonth = new Date(year, month, 1).getDay();
        // Adjust: Minggu(0) jadi 6, Senin(1) jadi 0 agar kalender mulai Senin
        const startingDayIndex = firstDayOfMonth === 0 ? 6 : firstDayOfMonth - 1;
        
        const daysInMonth = new Date(year, month + 1, 0).getDate();
        
        // Total kotak grid (biasanya 35 atau 42 agar rapi)
        // Kita pakai logic sederhana: ambil tanggal start grid (bisa bulan sebelumnya)
        const startDateGrid = new Date(year, month, 1);
        startDateGrid.setDate(startDateGrid.getDate() - startingDayIndex);

        const newGrid: CalendarDay[] = [];

        // Loop 42 kali (6 baris x 7 kolom) untuk mengisi grid
        for (let i = 0; i < 42; i++) {
            const currentDayLoop = new Date(startDateGrid);
            currentDayLoop.setDate(startDateGrid.getDate() + i);

            // Format YYYY-MM-DD (penting untuk matching event)
            const y = currentDayLoop.getFullYear();
            const m = String(currentDayLoop.getMonth() + 1).padStart(2, '0');
            const d = String(currentDayLoop.getDate()).padStart(2, '0');
            const fullDateString = `${y}-${m}-${d}`;

            // Cari event yang tanggalnya cocok
            const dayEvents = events.filter(evt => evt.date === fullDateString);

            newGrid.push({
            dateObj: currentDayLoop,
            dayNumber: currentDayLoop.getDate(),
            fullDate: fullDateString,
            isCurrentMonth: currentDayLoop.getMonth() === month,
            events: dayEvents
            });
        }

        setCalendarGrid(newGrid);
        };

        generateCalendarGrid();
    }, [currentDate, events, month, year]);

    // Handlers
    const handlePrevMonth = () => setCurrentDate(new Date(year, month - 1, 1));
    const handleNextMonth = () => setCurrentDate(new Date(year, month + 1, 1));

    return (
        <div className="w-full h-full bg-white rounded-3xl border border-neutral-300 p-6 flex flex-col">
        
        {/* --- HEADER --- */}
        <div className="flex justify-between items-center mb-6 flex-none">
            <div className="flex items-center gap-4">
            {/* Navigasi */}
            <div className="flex gap-2">
                <button onClick={handlePrevMonth} className="p-2 bg-sky-500 rounded-lg text-white hover:scale-110">
                    <ChevronLeft />
                </button>
                <button onClick={handleNextMonth} className="p-2 bg-sky-500 rounded-lg text-white hover:scale-110">
                    <ChevronRight />
                </button>
            </div>
            
            {/* Judul Bulan Tahun */}
            <h2 className="text-xl font-semibold text-black">
                {monthNames[month]} {year}
            </h2>
            </div>

            <button className="flex items-center gap-2 px-4 py-2 border border-sky-500 text-sky-500 rounded-full text-sm font-semibold hover:bg-sky-50 transition">
            <DetailIcon />
            Lihat Detail
            </button>
        </div>

        {/* --- GRID CONTENT --- */}
        <div className="border border-neutral-300 rounded-xl overflow-hidden flex-1 flex flex-col min-h-0">
            
            {/* Header Nama Hari (Senin - Minggu) */}
            <div className="grid grid-cols-7 bg-sky-50 divide-x divide-neutral-200 border-b border-neutral-300">
            {['Senin', 'Selasa', 'Rabu', 'Kamis', 'Jumat', 'Sabtu', 'Minggu'].map((day) => (
                <div key={day} className="py-3 text-center text-neutral-500 text-sm font-semibold">
                {day}
                </div>
            ))}
            </div>

            {/* Body Kalender */}
            <div className="grid grid-cols-7 bg-white divide-x divide-y divide-neutral-200 flex-1 overflow-y-auto">
            {calendarGrid.map((dayItem, index) => (
                <div 
                key={`${dayItem.fullDate}-${index}`} 
                className={`min-h-[100px] p-2 flex flex-col transition-colors hover:bg-neutral-50
                    ${!dayItem.isCurrentMonth ? 'bg-neutral-50/30 text-neutral-400' : 'bg-white text-neutral-700'}
                `}
                >
                {/* Angka Tanggal */}
                <span className={`text-sm font-normal mb-2 block
                    ${!dayItem.isCurrentMonth ? 'text-neutral-300' : 'text-neutral-700'}
                `}>
                    {dayItem.dayNumber}
                </span>

                {/* Event List (Scrollable inside cell if too many) */}
                <div className="flex flex-col gap-1 overflow-y-auto max-h-[80px] custom-scrollbar">
                    {dayItem.events.map((evt) => (
                    <EventPill key={evt.id} title={evt.title} color={evt.color} />
                    ))}
                </div>
                </div>
            ))}
            </div>
        </div>
        </div>
    );
    }