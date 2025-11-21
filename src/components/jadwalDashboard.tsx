'use client';
import { useState, useEffect } from "react";

interface EventItem {
  teacher: string;
  time: string;
  class: string;
  status?: string;
  statusColor?: string;
}

interface ScheduleDay {
  date: string;
  events: EventItem[];
}

// --- DATA DUMMY
const mockScheduleData: ScheduleDay[] = [
    {
        date: "1 Oktober",
        events: [
            {
                teacher: "RINJANI ORYZA SATIVA S.Pd",
                time: "14:00 - 17.00",
                class: "Kelas 5",
                statusColor: "text-sky-500"
            },
            {
                teacher: "NONI FITRI HANDAYANI S.Pd",
                time: "18:30 - 20.30",
                class: "Kelas 8",
                statusColor: "text-sky-500"
            }
        ]
    },
    {
        date: "2 Oktober",
        events: [
            {
                teacher: "RINJANI ORYZA SATIVA S.Pd",
                time: "14:00 - 17.00",
                class: "Kelas 6",
                statusColor: "text-sky-500"
            },
            {
                teacher: "NONI FITRI HANDAYANI S.Pd",
                time: "17:00 - 19.00",
                class: "Kelas 8",
                statusColor: "text-sky-500"
            },
            {
                teacher: "NONI FITRI HANDAYANI S.Pd",
                time: "19:00 - 21.00",
                class: "Kelas 7",
                statusColor: "text-sky-500"
            }
        ]
    },
    {
        date: "3 Oktober",
        events: [
            {
                teacher: "RINJANI ORYZA SATIVA S.Pd",
                time: "14:00 - 17.00",
                class: "Kelas 5 A",
                statusColor: "text-sky-500"
            }
        ]
    }
];

export default function JadwalDashboard() {
  const [scheduleData, setScheduleData] = useState<ScheduleDay[]>([]);

  useEffect(() => {
    // Langsung set data mock ke state tanpa loading/delay
    setScheduleData(mockScheduleData);
  }, []);
    // --- JIKA BACKEND SUDAH SIAP, GANTI DENGAN INI: ---
    /*
    const response = await fetch("/api/jadwal");
    if (!response.ok) throw new Error("Gagal mengambil data");
    const data = await response.json();
    setScheduleData(data);
    */

  return (
    <div className="bg-white rounded-xl w-full h-full p-6 border border-neutral-300 flex flex-col">
      <h1 className="text-xl font-semibold mb-6">Jadwal</h1>

      <div className="flex flex-col gap-8 overflow-y-auto">
        {scheduleData.length > 0 ? (
          scheduleData.map((day, index) => (
            <div key={index}>
              <div className="flex items-center mb-4">
                <h2 className="text-sm font-semibold text-black whitespace-nowrap mr-4">
                  {day.date}
                </h2>
                <div className="h-[1px] bg-neutral-200 w-full"></div>
              </div>

              <div className="flex flex-col gap-6">
                {day.events.map((event, evtIndex) => (
                  <div key={evtIndex} className="flex flex-col gap-1">
                    <h3 className="text-sm font-semibold text-neutral-400 uppercase">
                      {event.teacher}
                    </h3>
                    
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <span className="text-sm font-semibold text-neutral-500">
                          {event.time}
                        </span>
                        <div className="w-[2px] h-4 bg-neutral-300"></div>
                        <span className="text-sm font-bold text-black">
                          {event.class}
                        </span>
                      </div>
                      
                      {event.status && (
                         <span className={`text-xs font-medium ${event.statusColor || 'text-neutral-500'}`}>
                            {event.status}
                         </span>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))
        ) : (
          <div className="text-center text-neutral-400 text-sm py-10">
            Tidak ada jadwal tersedia.
          </div>
        )}
      </div>
    </div>
  );
}