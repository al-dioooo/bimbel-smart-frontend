'use client'

import { useMemo, useState } from "react"
import { useSearchParams } from "next/navigation"
import moment from "moment"
import { toast } from "sonner"
import { mutate } from "swr"

import PageHeader from "@/components/ui/page-header"
import PrimaryButton from "@/components/buttons/primary"
import OutlineButton from "@/components/buttons/outline"
import SelectDescription from "@/components/forms/select-description"
import SearchInput from "@/components/data/search-input"
import AbsensiTable, { type AttendanceDraft, type AttendanceNotes } from "@/components/absensi-table"
import AbsensiEditDialog, { type EditTarget } from "@/components/absensi-edit-dialog"
import { useListParams } from "@/components/data/use-list-params"
import { Check, ArrowNarrowRight } from "@/components/icons/outline"

import { useKelas } from "@/hooks/repositories/use-kelas"
import { useAccess } from "@/hooks/use-user"
import api from "@/lib/axios"
import type { Kelas } from "@/lib/types"

export default function ListAbsensiPage() {
    const { search, searchTemp, setSearchTemp } = useListParams()

    const { isAdmin, scope } = useAccess()
    // Mentors only fill attendance for the kelas they teach.
    const { data: kelasList, isLoading: isLoadingKelas } = useKelas({ paginate: false, ...scope })

    // The dashboard's reminders link here with ?kelas_id= to open that class.
    const searchParams = useSearchParams()
    const [selectedKelas, setSelectedKelas] = useState<number | null>(() => {
        const fromLink = Number(searchParams.get('kelas_id'))
        return Number.isInteger(fromLink) && fromLink > 0 ? fromLink : null
    })
    const [draft, setDraft] = useState<AttendanceDraft>({})
    const [notes, setNotes] = useState<AttendanceNotes>({})
    const [isSaving, setIsSaving] = useState(false)
    const [editing, setEditing] = useState<EditTarget | null>(null)

    // Revalidates every absensi list on screen after a save or a correction.
    const refreshAbsensi = () => mutate((key) => Array.isArray(key) && key[0] === '/absensi')

    // Default to the current month, matching the dashboard's window.
    const range = useMemo(
        () => ({
            from: moment().startOf('month').format('YYYY-MM-DD'),
            to: moment().endOf('month').format('YYYY-MM-DD'),
        }),
        []
    )

    const pendingCount = Object.values(draft).reduce(
        (sum, column) => sum + Object.values(column).filter(Boolean).length,
        0
    )

    /**
     * Sends the new entries only, one request per jadwal. A jadwal the API
     * refuses keeps its entries in the draft; the others are cleared.
     */
    const handleSave = async () => {
        if (!selectedKelas) {
            toast.error('Pilih kelas terlebih dahulu')
            return
        }

        const payloads = Object.entries(draft)
            .map(([jadwalId, column]) => ({
                jadwal_id: Number(jadwalId),
                absensi: Object.entries(column)
                    .filter(([, status]) => !!status)
                    .map(([siswaId, status]) => ({
                        siswa_id: Number(siswaId),
                        status: status as string,
                        // REQ-044: sent only when filled.
                        ...(notes[Number(jadwalId)]?.[Number(siswaId)]?.trim() ? { catatan: notes[Number(jadwalId)][Number(siswaId)].trim() } : {}),
                    })),
            }))
            .filter((payload) => payload.absensi.length > 0)

        if (payloads.length === 0) {
            toast.error('Belum ada absensi baru yang diisi')
            return
        }

        setIsSaving(true)
        try {
            const results = await Promise.allSettled(payloads.map((payload) => api.post('/absensi', payload)))
            const failed = results
                .map((result, index) => ({ result, payload: payloads[index] }))
                .filter(({ result }) => result.status === 'rejected')

            const saved = payloads.length - failed.length
            if (saved > 0) toast.success(`Absensi berhasil disimpan (${saved} jadwal)`)

            failed.forEach(({ result }) => {
                const reason = (result as PromiseRejectedResult).reason as { response?: { data?: { message?: string } } }
                toast.error(reason?.response?.data?.message || 'Gagal menyimpan absensi')
            })

            const keep = new Set(failed.map(({ payload }) => payload.jadwal_id))
            const onlyFailed = <T,>(current: Record<number, T>) =>
                Object.fromEntries(Object.entries(current).filter(([jadwalId]) => keep.has(Number(jadwalId))))
            setDraft(onlyFailed)
            setNotes(onlyFailed)
            await refreshAbsensi()
        } finally {
            setIsSaving(false)
        }
    }

    const kelasOptions = (kelasList as unknown as Kelas[]) ?? []

    return (
        <div className="w-full space-y-6 pb-20">
            <PageHeader
                title="Absensi"
                description={`Periode ${moment(range.from).format('D MMM')} – ${moment(range.to).format('D MMM YYYY')}`}
                action={
                    <OutlineButton
                        as="link"
                        href="/report/absensi"
                        buttonType="secondary"
                        className="text-xs"
                        icon={<ArrowNarrowRight className="w-4 h-4" />}
                        iconPosition="right"
                    >
                        Lihat Rekap
                    </OutlineButton>
                }
            />

            <div className="space-y-4">
                <div className="flex flex-col md:flex-row justify-between md:items-center gap-4">
                    <div className="flex flex-col sm:flex-row sm:items-center gap-2 w-full md:w-auto">
                        <SearchInput value={searchTemp} onChange={setSearchTemp} placeholder="Cari siswa" />

                        <div className="w-full sm:w-52">
                            <SelectDescription
                                title={(row: Kelas) => row?.nama}
                                description={(row: Kelas) => row?.tingkat}
                                keyValue={(row: Kelas) => row?.id}
                                selection={kelasOptions}
                                isLoading={isLoadingKelas}
                                placeholder="Pilih kelas"
                                value={selectedKelas ?? ''}
                                onChange={(value) => {
                                    // The selected class was previously tracked but never used.
                                    setSelectedKelas(value ? Number(value) : null)
                                    setDraft({})
                                    setNotes({})
                                }}
                            />
                        </div>
                    </div>

                    <PrimaryButton
                        type="button"
                        onClick={handleSave}
                        isLoading={isSaving}
                        disabled={isSaving || !selectedKelas || pendingCount === 0}
                        className="text-sm"
                        icon={<Check className="w-4 h-4" strokeWidth={2} />}
                    >
                        {pendingCount > 0 ? `Simpan (${pendingCount})` : 'Simpan'}
                    </PrimaryButton>
                </div>

                <AbsensiTable
                    kelasId={selectedKelas}
                    searchQuery={search || ''}
                    from={range.from}
                    to={range.to}
                    draft={draft}
                    onDraftChange={setDraft}
                    notes={notes}
                    onNotesChange={setNotes}
                    lockFuture={!isAdmin}
                    onEditRecorded={isAdmin ? (record, jadwal, siswa) => setEditing({ record, jadwal, siswa }) : undefined}
                />

                <p className="text-xs text-neutral-500">
                    <span className="mr-1 inline-flex min-w-6 justify-center rounded-md border border-sky-200 bg-sky-100 px-1 font-semibold text-sky-600">H</span>
                    sudah tercatat{isAdmin ? ' (klik untuk mengubah)' : '; perubahan dilakukan oleh admin'}.
                    <span className="ml-3 mr-1 font-semibold text-sky-600 underline decoration-dotted underline-offset-4">H</span>
                    belum disimpan.
                    <span className="ml-3 mr-1 inline-block h-2 w-2 rounded-full bg-amber-400" />
                    ada catatan.
                </p>
            </div>

            <AbsensiEditDialog target={editing} onClose={() => setEditing(null)} onSaved={refreshAbsensi} />
        </div>
    )
}
