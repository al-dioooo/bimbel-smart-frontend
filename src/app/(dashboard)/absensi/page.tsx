'use client'
/* eslint-disable @typescript-eslint/no-explicit-any */
import { useState, useEffect } from "react"
import moment from "moment"
import Filter from "./filter"
import AbsensiCard from "@/components/absensi-card"
import { ChevronDown } from "@/components/icons/outline"
import AbsensiAction, { AttendanceStatus } from "@/components/absensi-action"

interface Student {
    id: number
    name: string
    attendance: Record<string, AttendanceStatus>
}

// --- Mock Data ---
const MOCK_DATES = [
    "2025-10-02", "2025-10-07", "2025-10-09", "2025-10-14",
    "2025-10-16", "2025-10-21", "2025-10-23", "2025-10-28",
    "2025-10-30", "2025-11-01", "2025-11-04", "2025-11-06",
    "2025-11-08", "2025-11-10", "2025-11-12", "2025-11-14",
    "2025-11-16", "2025-11-18", "2025-11-20"
]

const MOCK_STUDENTS_DATA = Array.from({ length: 30 }).map((_, i) => ({
    id: i + 1,
    name: `Nama Siswa ${i + 1}`,
    attendance: MOCK_DATES.reduce((acc, date) => {
        const statuses: AttendanceStatus[] = ['H', 'H', 'H', 'S', 'I', 'A']
        acc[date] = statuses[Math.floor(Math.random() * statuses.length)]
        return acc
    }, {} as Record<string, AttendanceStatus>)
}))

export default function ListAbsensi() {
    const [students, setStudents] = useState<Student[]>([])
    const [dates, setDates] = useState<string[]>([])
    const [isLoading, setIsLoading] = useState<boolean>(true)
    const [filterValues, setFilterValues] = useState<any>({})

    const fetchData = async (params: any = {}) => {
        setIsLoading(true)
        try {
            await new Promise(resolve => setTimeout(resolve, 800))
            setStudents(MOCK_STUDENTS_DATA)
            setDates(MOCK_DATES)
        } catch (error) {
            console.error("Failed to fetch data", error)
        } finally {
            setIsLoading(false)
        }
    }

    useEffect(() => {
        fetchData()
    }, [])

    const handleFilterSubmit = (newFilter: any) => {
        setFilterValues(newFilter)
        fetchData(newFilter)
    }

    const handleFilterRemove = () => {
        setFilterValues({})
        fetchData({})
    }

    // --- DI SINI TEMPAT FUNGSI API ---
    const handleStatusChange = async (studentId: number, date: string, newStatus: AttendanceStatus) => {
        // 1. Optimistic Update: Update UI dulu agar terlihat cepat
        setStudents(prevStudents => prevStudents.map(student => {
            if (student.id === studentId) {
                return {
                    ...student,
                    attendance: {
                        ...student.attendance,
                        [date]: newStatus
                    }
                }
            }
            return student
        }))

        // 2. Kirim Request ke API (Backend)
        try {
            // Contoh implementasi fetch ke API kamu
            /*
            const response = await fetch('/api/absensi/update', {
                method: 'POST', // atau PATCH
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    studentId,
                    date,
                    status: newStatus
                })
            })

            if (!response.ok) {
                throw new Error("Gagal update di server")
            }
            */

            console.log(`Berhasil update: ID ${studentId}, Tanggal ${date}, Status ${newStatus}`)

        } catch (error) {
            console.error(error)
            alert("Gagal menyimpan perubahan ke server!")
            // Opsional: Revert (kembalikan) state jika gagal
        }
    }

    const HeaderCheckbox = ({ checked }: { checked?: boolean }) => (
        <div className={`w-5 h-5 rounded border flex items-center justify-center shrink-0 ${checked ? 'bg-sky-500 border-sky-500' : 'border-neutral-300 bg-white'}`}>
            {checked && (
                <svg className="w-3.5 h-3.5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                </svg>
            )}
        </div>
    )

    return (
        <div className="w-full space-y-6 pb-20">
            <div>
                <h1 className="text-2xl font-bold text-neutral-900">Absensi</h1>
            </div>

            <div className="flex flex-col xl:flex-row justify-between items-start xl:items-center gap-6">
                <div className="shrink-0">
                    <Filter
                        data={filterValues}
                        onSubmit={handleFilterSubmit}
                        onRemove={handleFilterRemove}
                    />
                </div>
                <div className="w-full xl:w-auto overflow-x-auto pb-2 xl:pb-0">
                    <AbsensiCard />
                </div>
            </div>

            <div className="border border-neutral-300 rounded-xl bg-white shadow-sm flex flex-col relative overflow-hidden">
                <div className="overflow-x-auto w-full">
                    <table className="w-full text-left border-separate border-spacing-0">
                        <thead className="bg-neutral-50">
                            <tr>
                                <th scope="col" className="sticky left-0 z-20 w-16 px-6 py-4 text-xs font-bold text-neutral-900 border-b border-neutral-300 bg-neutral-50">
                                    No
                                </th>
                                <th scope="col" className="sticky left-[4rem] z-20 min-w-[200px] px-6 py-4 text-xs font-bold text-neutral-900 border-b border-neutral-300 bg-neutral-50">
                                    Nama
                                </th>
                                {dates.map((date, index) => (
                                    <th key={index} scope="col" className="min-w-[100px] px-4 py-4 text-xs font-bold text-neutral-900 border-b border-neutral-300 bg-neutral-50">
                                        <div className="flex items-center space-x-2 justify-center">
                                            <span>{moment(date).format('D/M')}</span>
                                            <HeaderCheckbox checked={index % 2 !== 0} />
                                        </div>
                                    </th>
                                ))}
                            </tr>
                        </thead>

                        <tbody className="divide-y divide-neutral-200 bg-white">
                            {isLoading ? (
                                <tr>
                                    <td colSpan={dates.length + 2} className="px-6 py-12 text-center text-sm text-neutral-500">
                                        Loading Data Absensi...
                                    </td>
                                </tr>
                            ) : students.length > 0 ? (
                                students.map((student, index) => (
                                    <tr key={student.id} className="hover:bg-neutral-50 transition-colors group">

                                        <td className="sticky left-0 z-10 w-16 px-6 py-4 text-sm text-neutral-900 border-neutral-300 bg-white group-hover:bg-neutral-50">
                                            {index + 1}
                                        </td>

                                        <td className="sticky left-[4rem] z-10 min-w-[200px] px-6 py-4 text-sm font-medium text-neutral-900 whitespace-nowrap border-neutral-300  group-hover:bg-neutral-50">
                                            {student.name}
                                        </td>

                                        {/* BAGIAN UTAMA ABSENSI ACTION */}
                                        {dates.map((date) => (
                                            <td key={date} className="px-4 py-4 text-center border-b border-neutral-100 last:border-b-0">

                                                <AbsensiAction
                                                    onSelect={(status) => handleStatusChange(student.id, date, status)}
                                                >
                                                    {/* PERUBAHAN DI SINI: Menghapus class opacity */}
                                                    <div className="inline-flex items-center space-x-1 cursor-pointer justify-center w-full">
                                                        <span className="text-sm font-medium text-neutral-700">
                                                            {student.attendance[date] || "-"}
                                                        </span>
                                                        {/* Icon Chevron sekarang selalu terlihat */}
                                                        <ChevronDown className="w-4 h-4 text-neutral-500" />
                                                    </div>
                                                </AbsensiAction>

                                            </td>
                                        ))}
                                    </tr>
                                ))
                            ) : (
                                <tr>
                                    <td colSpan={dates.length + 2} className="px-6 py-8 text-center text-sm text-neutral-500">
                                        Data tidak ditemukan
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