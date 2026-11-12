'use client'

import { useEffect, useMemo } from 'react'
import moment from 'moment'
import { toast } from 'sonner'

import AbsensiAction from '@/components/absensi-action'
import { ChevronDown, Check } from '@/components/icons/outline'
import { useJadwal } from '@/hooks/repositories/use-jadwal'
import { useSiswa } from '@/hooks/repositories/use-siswa'
import { useAbsensi } from '@/hooks/repositories/use-absensi'
import { attendance, normalizeAttendance, toneClasses, type AttendanceCode } from '@/lib/status'
import { cn } from '@/lib/utils'
import type { Jadwal, Siswa, Absensi } from '@/lib/types'

/**
 * New, unsaved entries only: `{ [jadwalId]: { [siswaId]: code } }`. Recorded
 * attendance is never re-sent; the API refuses it as input ganda (UC-08 2a).
 */
export type AttendanceDraft = Record<number, Record<number, AttendanceCode | null>>

type Props = {
    kelasId?: number | null
    searchQuery?: string
    from?: string
    to?: string
    draft: AttendanceDraft
    onDraftChange: (next: AttendanceDraft) => void
    /** Read-only columns for jadwal after today (mentors; the API refuses them). */
    lockFuture?: boolean
    /** Admins correct a recorded cell (UC-09); mentors only read it. */
    onEditRecorded?: (record: Absensi, jadwal: Jadwal, siswa: Siswa) => void
}

export default function AbsensiTable({
    kelasId,
    searchQuery = '',
    from,
    to,
    draft,
    onDraftChange,
    lockFuture = false,
    onEditRecorded,
}: Props) {
    const hasKelas = !!kelasId
    const isLocked = (jadwal: Jadwal) =>
        lockFuture && moment(jadwal.tanggal as unknown as string).isAfter(moment(), 'day')

    // Columns are the class's jadwal; rows are its roster. Both used to be
    // hardcoded arrays (INITIAL_HEADERS / INITIAL_STUDENTS).
    const { data: jadwalData, isLoading: isLoadingJadwal } = useJadwal(
        { kelas_id: kelasId, from, to, paginate: false, order_by: 'tanggal', direction: 'asc' },
    )
    const { data: siswaData, isLoading: isLoadingSiswa } = useSiswa(
        { kelas_id: kelasId, paginate: false, order_by: 'nama', direction: 'asc' },
    )
    const { data: absensiData, isLoading: isLoadingAbsensi } = useAbsensi(
        { kelas_id: kelasId, from, to },
        hasKelas
    )

    const columns = useMemo(
        () => ((jadwalData as unknown as Jadwal[] | undefined) ?? []),
        [jadwalData]
    )
    const students = useMemo(
        () => ((siswaData as unknown as Siswa[] | undefined) ?? []),
        [siswaData]
    )

    // What is already recorded, by jadwal and siswa. It is shown, never
    // re-sent: the API refuses a second record for the same siswa (UC-08).
    const recorded = useMemo(() => {
        const map: Record<number, Record<number, Absensi>> = {}
        ;((absensiData as Absensi[] | undefined) ?? []).forEach((row) => {
            map[row.jadwal_id] = { ...(map[row.jadwal_id] ?? {}), [row.siswa_id]: row }
        })
        return map
    }, [absensiData])

    // Someone else may record a siswa that is still in this draft. Sending it
    // would make the API refuse the whole jadwal (input ganda) on every retry,
    // so a cell that is now recorded leaves the draft.
    useEffect(() => {
        let dropped = 0
        const next: AttendanceDraft = {}
        Object.entries(draft).forEach(([jadwalId, column]) => {
            next[Number(jadwalId)] = Object.fromEntries(
                Object.entries(column).filter(([siswaId, status]) => {
                    const stale = !!recorded[Number(jadwalId)]?.[Number(siswaId)]
                    if (stale && status) dropped += 1
                    return !stale
                })
            )
        })
        if (dropped > 0) {
            onDraftChange(next)
            toast.info(`${dropped} isian dihapus dari draf karena absensinya sudah tercatat.`)
        }
    }, [recorded, draft, onDraftChange])

    const filtered = useMemo(() => {
        const query = searchQuery.trim().toLowerCase()
        if (!query) return students
        return students.filter((s) => s.nama.toLowerCase().includes(query))
    }, [students, searchQuery])

    const setCell = (jadwalId: number, siswaId: number, status: AttendanceCode | null) => {
        onDraftChange({
            ...draft,
            [jadwalId]: { ...(draft[jadwalId] ?? {}), [siswaId]: status },
        })
    }

    /** Students of a column that have no record yet, i.e. the editable cells. */
    const openStudents = (jadwalId: number) => students.filter((s) => !recorded[jadwalId]?.[s.id])

    /** Header checkbox marks the open cells of a column hadir (UC-07), or clears them. */
    const toggleColumn = (jadwalId: number) => {
        const column = draft[jadwalId] ?? {}
        const open = openStudents(jadwalId)
        const allPresent = open.length > 0 && open.every((s) => column[s.id] === 'h')

        onDraftChange({
            ...draft,
            [jadwalId]: Object.fromEntries(
                open.map((s) => [s.id, allPresent ? null : ('h' as AttendanceCode)])
            ),
        })
    }

    const isLoading = isLoadingJadwal || isLoadingSiswa || isLoadingAbsensi

    if (!hasKelas) {
        return (
            <div className="border border-neutral-200 rounded-xl bg-white px-6 py-16 text-center">
                <p className="text-sm text-neutral-500">Pilih kelas untuk menampilkan absensi.</p>
            </div>
        )
    }

    return (
        <div className="w-full">
            {/* `bg-whiteflex` — a missing space — meant this had no background at all. */}
            <div className="border border-neutral-200 rounded-xl bg-white flex flex-col relative overflow-hidden">
                <div className="overflow-x-auto w-full">
                    <table className="min-w-full text-left border-separate border-spacing-0">
                        <thead className="bg-neutral-50">
                            <tr>
                                <th scope="col" className="sticky left-0 z-20 w-12 px-4 py-3 text-xs font-bold text-neutral-900 border-b border-neutral-200 bg-neutral-50 text-center">
                                    No
                                </th>
                                <th scope="col" className="sticky left-12 z-20 min-w-[200px] px-6 py-3 text-xs font-bold text-neutral-900 border-b border-neutral-200 bg-neutral-50">
                                    Nama
                                </th>
                                {columns.map((jadwal) => {
                                    const column = draft[jadwal.id] ?? {}
                                    const open = openStudents(jadwal.id)
                                    const allPresent = open.length > 0 && open.every((s) => column[s.id] === 'h')
                                    const headerLocked = isLocked(jadwal) || open.length === 0

                                    return (
                                        <th key={jadwal.id} scope="col" className="min-w-[90px] px-2 py-3 border-b border-neutral-200 bg-neutral-50">
                                            <div className="flex items-center gap-2 justify-center">
                                                <span className="text-xs font-bold text-neutral-900">
                                                    {moment(jadwal.tanggal as unknown as string).format('D/M')}
                                                </span>
                                                <button
                                                    type="button"
                                                    disabled={headerLocked}
                                                    title={isLocked(jadwal) ? 'Belum bisa diisi' : open.length === 0 ? 'Semua siswa sudah tercatat' : undefined}
                                                    onClick={() => toggleColumn(jadwal.id)}
                                                    aria-label={`Tandai semua hadir ${moment(jadwal.tanggal as unknown as string).format('D MMMM')}`}
                                                    className={cn(
                                                        'w-5 h-5 rounded border cursor-pointer flex items-center justify-center transition-colors',
                                                        allPresent
                                                            ? 'bg-sky-500 border-sky-500 text-white'
                                                            : 'bg-white border-neutral-300 hover:border-sky-400',
                                                        headerLocked && 'cursor-not-allowed opacity-40 hover:border-neutral-300'
                                                    )}
                                                >
                                                    {allPresent && <Check className="w-3 h-3" strokeWidth={3} />}
                                                </button>
                                            </div>
                                        </th>
                                    )
                                })}
                            </tr>
                        </thead>

                        <tbody className="divide-y divide-neutral-200 bg-white">
                            {isLoading ? (
                                <tr>
                                    <td colSpan={columns.length + 2} className="px-6 py-10 text-center text-sm text-neutral-500">
                                        Memuat absensi…
                                    </td>
                                </tr>
                            ) : columns.length === 0 ? (
                                <tr>
                                    <td colSpan={2} className="px-6 py-10 text-center text-sm text-neutral-500">
                                        Belum ada jadwal untuk kelas ini.
                                    </td>
                                </tr>
                            ) : filtered.length === 0 ? (
                                <tr>
                                    <td colSpan={columns.length + 2} className="px-6 py-10 text-center text-sm text-neutral-500">
                                        {searchQuery
                                            ? `Tidak ada siswa dengan nama "${searchQuery}"`
                                            : 'Belum ada siswa di kelas ini.'}
                                    </td>
                                </tr>
                            ) : (
                                filtered.map((student, index) => (
                                    <tr key={student.id} className="hover:bg-neutral-50 transition-colors group">
                                        <td className="sticky left-0 z-10 w-12 px-4 py-3 text-sm text-neutral-900 bg-white group-hover:bg-neutral-50 text-center">
                                            {index + 1}
                                        </td>
                                        <td className="sticky left-12 z-10 min-w-[200px] px-6 py-3 text-sm font-medium text-neutral-900 whitespace-nowrap bg-white group-hover:bg-neutral-50">
                                            {student.nama}
                                        </td>

                                        {columns.map((jadwal) => {
                                            const saved = recorded[jadwal.id]?.[student.id]
                                            const code = draft[jadwal.id]?.[student.id] ?? null

                                            if (saved) {
                                                const savedCode = normalizeAttendance(saved.status)
                                                const label = savedCode ? attendance[savedCode].label : saved.status
                                                const badge = (
                                                    <span
                                                        className={cn(
                                                            'inline-flex min-w-7 items-center justify-center rounded-md border px-1.5 py-0.5 text-xs font-semibold',
                                                            savedCode ? toneClasses[attendance[savedCode].tone] : toneClasses.neutral
                                                        )}
                                                    >
                                                        {savedCode ? attendance[savedCode].short : '?'}
                                                    </span>
                                                )

                                                return (
                                                    <td key={jadwal.id} className="px-2 py-3 text-center">
                                                        {onEditRecorded ? (
                                                            <button
                                                                type="button"
                                                                onClick={() => onEditRecorded(saved, jadwal, student)}
                                                                title={`${label}, sudah tercatat. Klik untuk mengubah.`}
                                                                aria-label={`Ubah absensi ${student.nama} ${moment(jadwal.tanggal as unknown as string).format('D MMMM')}`}
                                                                className="cursor-pointer rounded-md hover:ring-2 hover:ring-sky-200"
                                                            >
                                                                {badge}
                                                            </button>
                                                        ) : (
                                                            <span title={`${label}, sudah tercatat. Perubahan dilakukan oleh admin.`}>{badge}</span>
                                                        )}
                                                    </td>
                                                )
                                            }

                                            if (isLocked(jadwal)) {
                                                return (
                                                    <td key={jadwal.id} className="px-2 py-3 text-center">
                                                        <span className="text-sm font-semibold text-neutral-200" title="Belum bisa diisi">–</span>
                                                    </td>
                                                )
                                            }

                                            return (
                                                <td key={jadwal.id} className="px-2 py-3 text-center">
                                                    <AbsensiAction onSelect={(status) => setCell(jadwal.id, student.id, status)}>
                                                        <div className="inline-flex items-center justify-center gap-1 cursor-pointer w-full py-1">
                                                            <span
                                                                className={cn(
                                                                    'text-sm font-semibold',
                                                                    code ? 'text-sky-600 underline decoration-dotted underline-offset-4' : 'text-neutral-300'
                                                                )}
                                                                title={code ? `${attendance[code].label}, belum disimpan` : 'Belum diisi'}
                                                            >
                                                                {code ? attendance[code].short : '–'}
                                                            </span>
                                                            <ChevronDown className="w-3 h-3 text-neutral-400" />
                                                        </div>
                                                    </AbsensiAction>
                                                </td>
                                            )
                                        })}
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    )
}
