'use client'

import { useMemo, useState } from "react"
import moment from "moment"
import { toast } from "sonner"

import PageHeader from "@/components/ui/page-header"
import PrimaryButton from "@/components/buttons/primary"
import OutlineButton from "@/components/buttons/outline"
import SelectDescription from "@/components/forms/select-description"
import SearchInput from "@/components/data/search-input"
import AbsensiTable, { type AttendanceDraft } from "@/components/absensi-table"
import { useListParams } from "@/components/data/use-list-params"
import { Check, ArrowNarrowRight } from "@/components/icons/outline"

import { useKelas } from "@/hooks/repositories/use-kelas"
import api from "@/lib/axios"
import type { Kelas } from "@/lib/types"

export default function ListAbsensiPage() {
    const { search, searchTemp, setSearchTemp } = useListParams()

    const { data: kelasList, isLoading: isLoadingKelas } = useKelas({ paginate: false })

    const [selectedKelas, setSelectedKelas] = useState<number | null>(null)
    const [draft, setDraft] = useState<AttendanceDraft>({})
    const [isSaving, setIsSaving] = useState(false)

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

    /** Was `console.log("Simpan data...")`. */
    const handleSave = async () => {
        if (!selectedKelas) {
            toast.error('Pilih kelas terlebih dahulu')
            return
        }

        // One request per jadwal column that has at least one filled cell.
        const payloads = Object.entries(draft)
            .map(([jadwalId, column]) => ({
                jadwal_id: Number(jadwalId),
                absensi: Object.entries(column)
                    .filter(([, status]) => !!status)
                    .map(([siswaId, status]) => ({ siswa_id: Number(siswaId), status: status as string })),
            }))
            .filter((payload) => payload.absensi.length > 0)

        if (payloads.length === 0) {
            toast.error('Belum ada absensi yang diisi')
            return
        }

        setIsSaving(true)
        try {
            await Promise.all(payloads.map((payload) => api.post('/absensi', payload)))
            toast.success(`Absensi tersimpan (${pendingCount} entri)`)
        } catch (error: unknown) {
            const message = (error as { response?: { data?: { message?: string } } })?.response?.data?.message
            toast.error(message || 'Gagal menyimpan absensi')
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
                                }}
                            />
                        </div>
                    </div>

                    <PrimaryButton
                        type="button"
                        onClick={handleSave}
                        isLoading={isSaving}
                        disabled={isSaving || !selectedKelas}
                        className="text-sm"
                        icon={<Check className="w-4 h-4" strokeWidth={2} />}
                    >
                        Simpan
                    </PrimaryButton>
                </div>

                <AbsensiTable
                    kelasId={selectedKelas}
                    searchQuery={search || ''}
                    from={range.from}
                    to={range.to}
                    draft={draft}
                    onDraftChange={setDraft}
                />
            </div>
        </div>
    )
}
