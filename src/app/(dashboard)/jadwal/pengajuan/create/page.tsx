"use client"

import { FormEvent, useState } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import moment from "moment"
import { toast } from "sonner"

import PageHeader from "@/components/ui/page-header"
import PrimaryButton from "@/components/buttons/primary"
import Description from "@/components/forms/description"
import FormSection from "@/components/forms/form-section"
import Input from "@/components/forms/input"
import InputDate from "@/components/forms/input-date"
import Label from "@/components/forms/label"
import SelectDescription from "@/components/forms/select-description"

import { useJadwal } from "@/hooks/repositories/use-jadwal"
import { useAccess } from "@/hooks/use-user"
import api from "@/lib/axios"
import { formatDate, formatTimeRange } from "@/lib/format"
import type { Jadwal } from "@/lib/types"

type ApiError = { response?: { status?: number; data?: { message?: string; errors?: Record<string, string[]> } } }

/** <input type="time"> works in HH:mm; the API validates H:i:s. */
const toInputTime = (value?: string | null) => (value ?? "").slice(0, 5)
const toApiTime = (value: string) => (value.length === 5 ? `${value}:00` : value)
const toDate = (value: Jadwal["tanggal"]) => moment(value as unknown as string).format("YYYY-MM-DD")

/** A mentor asks to move one of their upcoming jadwal; an admin approves it. */
export default function CreatePengajuanJadwal() {
    const router = useRouter()
    const searchParams = useSearchParams()
    const { scope } = useAccess()

    const { data, isLoading } = useJadwal({
        ...scope,
        from: moment().format("YYYY-MM-DD"),
        to: moment().add(1, "year").format("YYYY-MM-DD"),
        paginate: false,
        order_by: "tanggal",
        direction: "asc",
    })
    const jadwalList = (data as unknown as Jadwal[] | undefined) ?? []

    const [jadwalId, setJadwalId] = useState<number | null>(
        searchParams.get("jadwal_id") ? Number(searchParams.get("jadwal_id")) : null
    )
    const [tanggal, setTanggal] = useState("")
    const [waktuMulai, setWaktuMulai] = useState("")
    const [waktuSelesai, setWaktuSelesai] = useState("")
    const [alasan, setAlasan] = useState("")
    const [errors, setErrors] = useState<Record<string, string[]>>({})
    const [isSaving, setIsSaving] = useState(false)

    const selected = jadwalList.find((row) => row.id === jadwalId)

    // Seed the "after" fields from the chosen jadwal, once per selection —
    // including a jadwal_id preselected from the query string once the list loads.
    const [seededFor, setSeededFor] = useState<number | null>(null)
    if (selected && seededFor !== selected.id) {
        setSeededFor(selected.id)
        setTanggal(toDate(selected.tanggal))
        setWaktuMulai(toInputTime(selected.waktu_mulai))
        setWaktuSelesai(toInputTime(selected.waktu_selesai))
    }

    const submitHandler = async (e: FormEvent) => {
        e.preventDefault()

        if (!selected) {
            setErrors({ jadwal_id: ["Pilih jadwal yang ingin diubah"] })
            return
        }

        setIsSaving(true)
        try {
            await api.post("/pengajuan-jadwal", {
                jadwal_id: selected.id,
                tanggal_sebelum: toDate(selected.tanggal),
                // Already H:i:s from the API; sent untouched so it matches the jadwal exactly.
                waktu_mulai_sebelum: selected.waktu_mulai,
                waktu_selesai_sebelum: selected.waktu_selesai,
                tanggal_sesudah: tanggal || null,
                waktu_mulai_sesudah: waktuMulai ? toApiTime(waktuMulai) : null,
                waktu_selesai_sesudah: waktuSelesai ? toApiTime(waktuSelesai) : null,
                alasan: alasan || null,
            })
            toast.success("Pengajuan terkirim")
            router.push("/jadwal/pengajuan")
        } catch (error: unknown) {
            const response = (error as ApiError).response
            if (response?.status === 422) {
                setErrors(response.data?.errors ?? {})
            } else {
                toast.error(response?.data?.message || "Gagal mengirim pengajuan")
            }
        } finally {
            setIsSaving(false)
        }
    }

    return (
        <div className="space-y-8">
            <PageHeader title="Ajukan Perubahan Jadwal" description="Admin akan meninjau pengajuan Anda." />

            <form className="space-y-6" onSubmit={submitHandler}>
                <FormSection title="Jadwal" description="Pilih jadwal mendatang yang ingin dipindah.">
                    <div className="space-y-4">
                        <div>
                            <Label htmlFor="jadwal_id" value="Jadwal" />
                            <SelectDescription
                                placeholder="Pilih jadwal"
                                selection={jadwalList}
                                isLoading={isLoading}
                                keyValue={(row: Jadwal) => row?.id}
                                title={(row: Jadwal) => row?.kelas?.nama && `${row.kelas.nama} — ${formatDate(row.tanggal as unknown as string)}`}
                                description={(row: Jadwal) => row?.waktu_mulai && formatTimeRange(row.waktu_mulai, row.waktu_selesai)}
                                value={jadwalId ?? ""}
                                onChange={(value) => setJadwalId(value ? Number(value) : null)}
                                error={errors.jadwal_id}
                            />
                            <Description
                                value={!isLoading && jadwalList.length === 0 ? "Tidak ada jadwal mendatang." : ""}
                                error={errors.jadwal_id}
                            />
                        </div>
                    </div>
                </FormSection>

                <FormSection title="Perubahan" description="Tanggal dan jam baru yang diusulkan.">
                    <div className="grid gap-4 sm:grid-cols-2">
                        <div className="sm:col-span-2">
                            <Label htmlFor="tanggal_sesudah" value="Tanggal Baru" />
                            <InputDate
                                value={tanggal ? moment(tanggal).toDate() : undefined}
                                onChange={(value) => setTanggal(value ? moment(value).format("YYYY-MM-DD") : "")}
                            />
                            <Description value="" error={errors.tanggal_sesudah} />
                        </div>

                        <div>
                            <Label htmlFor="waktu_mulai_sesudah" value="Waktu Mulai" />
                            <Input
                                id="waktu_mulai_sesudah"
                                type="time"
                                value={waktuMulai}
                                onChange={(e) => setWaktuMulai(e.target.value)}
                                error={errors.waktu_mulai_sesudah}
                            />
                            <Description value="" error={errors.waktu_mulai_sesudah} />
                        </div>

                        <div>
                            <Label htmlFor="waktu_selesai_sesudah" value="Waktu Selesai" />
                            <Input
                                id="waktu_selesai_sesudah"
                                type="time"
                                value={waktuSelesai}
                                onChange={(e) => setWaktuSelesai(e.target.value)}
                                error={errors.waktu_selesai_sesudah}
                            />
                            <Description value="" error={errors.waktu_selesai_sesudah} />
                        </div>

                        <div className="sm:col-span-2">
                            <Label htmlFor="alasan" value="Alasan" />
                            <Input
                                id="alasan"
                                placeholder="Alasan perubahan jadwal"
                                value={alasan}
                                onChange={(e) => setAlasan(e.target.value)}
                                error={errors.alasan}
                            />
                            <Description value="" error={errors.alasan} />
                        </div>
                    </div>
                </FormSection>

                <div className="flex items-center justify-end text-sm">
                    <PrimaryButton type="submit" isLoading={isSaving} disabled={isSaving}>
                        Kirim Pengajuan
                    </PrimaryButton>
                </div>
            </form>
        </div>
    )
}
