'use client'

import { useState, useEffect } from "react"
import AbsensiAction, { AttendanceStatus } from "@/components/absensi-action"
import { ChevronDown } from "@/components/icons/outline"

// --- ICONS ---
const CheckIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="w-3 h-3 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
    </svg>
)

// --- TYPES & DATA ---
interface Student {
    id: number
    name: string
    // Mengizinkan undefined/null agar bisa di-reset
    attendance: Record<string, AttendanceStatus | undefined | null>
}

// Initial Data Headers
const INITIAL_HEADERS = [
    { date: "2/10", checked: false },
    { date: "7/10", checked: false }, // Default false biar kelihatan efeknya
    { date: "9/10", checked: false },
    { date: "14/10", checked: false },
    { date: "16/10", checked: false },
    { date: "21/10", checked: false },
    { date: "23/10", checked: false },
    { date: "28/10", checked: false },
    { date: "30/10", checked: false },
]

// Mock Students Data
const INITIAL_STUDENTS: Student[] = [
    { id: 1, name: "PUTRI CANTIKA", attendance: { "2/10": "H" } },
    { id: 2, name: "NONI SOFIA", attendance: { "2/10": "H" } },
    { id: 3, name: "AHMAD DANI", attendance: { "2/10": "H" } },
    { id: 4, name: "BUDI SANTOSO", attendance: { "2/10": "H" } },
    { id: 5, name: "CITRA KIRANA", attendance: { "2/10": "H" } },
    { id: 6, name: "DEWI SARTIKA", attendance: { "2/10": "S" } },
    { id: 7, name: "EKO PATRIO", attendance: { "2/10": "H" } },
    { id: 8, name: "FAJAR SADBOY", attendance: { "2/10": "H" } },
]

// --- COMPONENT START ---
export default function AbsensiTable({ searchQuery = "" }: { searchQuery?: string }) {
    // 1. Ubah Headers jadi State
    const [headers, setHeaders] = useState(INITIAL_HEADERS)
    const [students, setStudents] = useState<Student[]>(INITIAL_STUDENTS)
    const [filteredStudents, setFilteredStudents] = useState<Student[]>(INITIAL_STUDENTS)

    // Filter Logic
    useEffect(() => {
        if (searchQuery) {
            const lowerQuery = searchQuery.toLowerCase()
            const filtered = students.filter(student => 
                student.name.toLowerCase().includes(lowerQuery)
            )
            setFilteredStudents(filtered)
        } else {
            setFilteredStudents(students)
        }
    }, [searchQuery, students])

    // Handler untuk ganti status satu per satu
    const handleStatusChange = (studentId: number, dateKey: string, newStatus: AttendanceStatus) => {
        setStudents(prev => prev.map(student => {
            if (student.id === studentId) {
                return {
                    ...student,
                    attendance: { ...student.attendance, [dateKey]: newStatus }
                }
            }
            return student
        }))
    }

    // 2. Handler untuk Header Checkbox (Bulk Update)
    const handleHeaderToggle = (dateKey: string) => {
        // A. Update visual checkbox di header
        const newHeaders = headers.map(h => {
            if (h.date === dateKey) {
                return { ...h, checked: !h.checked }
            }
            return h
        })
        setHeaders(newHeaders)

        // B. Cek status baru (apakah jadi true atau false)
        const isChecked = newHeaders.find(h => h.date === dateKey)?.checked

        // C. Update semua siswa
        setStudents(prev => prev.map(student => {
            return {
                ...student,
                attendance: {
                    ...student.attendance,
                    // Jika di-check -> Set 'H', Jika uncheck -> Hapus status (undefined)
                    [dateKey]: isChecked ? 'H' : undefined 
                }
            }
        }))
    }

    // Komponen Header Checkbox dengan onClick
    const HeaderCheckbox = ({ checked, onClick }: { checked: boolean, onClick: () => void }) => (
        <div 
            onClick={onClick}
            className={`w-5 h-5 rounded border cursor-pointer flex items-center justify-center transition-colors ${checked ? 'bg-sky-500 border-sky-500' : 'bg-white border-neutral-300 hover:border-sky-400'}`}
        >
            {checked && <CheckIcon />}
        </div>
    )

    return (
        <div className="w-full">
            {/* --- TABLE CONTAINER --- */}
            <div className="border border-neutral-300 rounded-xl bg-whiteflex flex-col relative overflow-hidden">
                <div className="overflow-x-auto w-full">
                    <table className="min-w-full text-left border-separate border-spacing-0">
                        
                        {/* HEADER */}
                        <thead className="bg-neutral-50">
                            <tr>
                                <th scope="col" className="sticky left-0 z-20 w-12 px-4 py-3 text-xs font-bold text-neutral-900 border-b border-neutral-300 bg-neutral-50 text-center">
                                    No
                                </th>
                                <th scope="col" className="sticky left-[3rem] z-20 min-w-[200px] px-6 py-3 text-xs font-bold text-neutral-900 border-b border-neutral-300 bg-neutral-50">
                                    Nama
                                </th>
                                {/* 3. Gunakan state 'headers' dan pasang 'handleHeaderToggle' */}
                                {headers.map((header, index) => (
                                    <th key={index} scope="col" className="min-w-[80px] px-2 py-3 border-b border-neutral-300 bg-neutral-50">
                                        <div className="flex items-center space-x-2 justify-center">
                                            <span className="text-xs font-bold text-neutral-900">{header.date}</span>
                                            <HeaderCheckbox 
                                                checked={header.checked} 
                                                onClick={() => handleHeaderToggle(header.date)}
                                            />
                                        </div>
                                    </th>
                                ))}
                            </tr>
                        </thead>

                        {/* BODY */}
                        <tbody className="divide-y divide-neutral-200 bg-white">
                            {filteredStudents.length > 0 ? (
                                filteredStudents.map((student, index) => (
                                    <tr key={student.id} className="hover:bg-neutral-50 transition-colors group">
                                        
                                        <td className="sticky left-0 z-10 w-12 px-4 py-3 text-sm text-neutral-900 border-neutral-300 bg-white group-hover:bg-neutral-50 text-center">
                                            {index + 1}
                                        </td>
                                        
                                        <td className="sticky left-[3rem] z-10 min-w-[200px] px-6 py-3 text-sm font-medium text-neutral-900 whitespace-nowrap border-neutral-300 bg-white group-hover:bg-neutral-50">
                                            {student.name}
                                        </td>

                                        {headers.map((header) => (
                                            <td key={header.date} className="px-2 py-3 text-center border-b border-neutral-100 last:border-b-0">
                                                <AbsensiAction 
                                                    onSelect={(status) => handleStatusChange(student.id, header.date, status)}
                                                >
                                                    <div className="inline-flex items-center justify-center space-x-1 cursor-pointer w-full py-1">
                                                        <span className="text-sm font-medium text-neutral-700">
                                                            {/* Tampilkan "-" jika status undefined/null */}
                                                            {student.attendance[header.date] || "-"}
                                                        </span>
                                                        <ChevronDown className="w-3 h-3 text-neutral-400" />
                                                    </div>
                                                </AbsensiAction>
                                            </td>
                                        ))}
                                    </tr>
                                ))
                            ) : (
                                <tr>
                                    <td colSpan={headers.length + 2} className="px-6 py-8 text-center text-sm text-neutral-500">
                                        Tidak ada siswa dengan nama &quot;{searchQuery}&quot;
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    )
}