"use client"

import { FormEvent, useState } from "react"

import PrimaryButton from "@/components/buttons/primary"
import Description from "@/components/forms/description"
import FormSection from "@/components/forms/form-section"
import Input from "@/components/forms/input"
import Label from "@/components/forms/label"
import { useKelas } from "@/hooks/repositories/use-kelas"
import SelectDescription from "@/components/forms/select-description"
import InputDate from "@/components/forms/input-date"
import moment from "moment"

/**
 * What this form seeds from, kept structural so the `Jadwal` in @/lib/types is
 * assignable: that one has no `mentor_id` (which this form never submits) and
 * models `tanggal` as a Date, while the API sends a YYYY-MM-DD string.
 */
type Jadwal = {
    id: number
    kelas_id?: number | null
    mentor_id?: number | null

    tanggal?: string | Date | null
    waktu_mulai?: string | null  // HH:MM
    waktu_selesai?: string | null
    materi?: string | null
}

type Props = {
    data?: Jadwal
    isLoading?: boolean
    onSubmit: (value: Record<string, unknown>) => void
    errors: Record<string, string[]>
}

export default function Form({ data, onSubmit, errors }: Props) {
    // Seeded straight from `data`. The caller keys this component on the record
    // id, so a freshly loaded record remounts and re-seeds; a background SWR
    // revalidation of the same record no longer wipes what is being typed.
    const [kelasId, setKelasId] = useState<string | number>(data?.kelas_id ?? "")

    const [tanggal, setTanggal] = useState<string>(
        data?.tanggal ? moment(data.tanggal).format("YYYY-MM-DD") : ""
    )
    const [waktuMulai, setWaktuMulai] = useState<string>(data?.waktu_mulai ?? "")
    const [waktuSelesai, setWaktuSelesai] = useState<string>(data?.waktu_selesai ?? "")
    const [materi, setMateri] = useState<string>(data?.materi ?? "")

    const { data: kelasDataList, isLoading: isLoadingMentorDataList } = useKelas({
        paginate: false
    })

    const submitHandler = (e: FormEvent) => {
        e.preventDefault()

        onSubmit({
            kelas_id: kelasId ? Number(kelasId) : null,

            tanggal: tanggal || null,
            waktu_mulai: waktuMulai || null,
            waktu_selesai: waktuSelesai || null,
            materi: materi || null,
        })
    }

    return (
        <form className="space-y-6" onSubmit={submitHandler} method="POST">
            {/* Waktu & Materi */}
            <FormSection title="Jadwal dan Materi">
                <div className="grid gap-4 sm:grid-cols-2">
                    <div>
                        <Label htmlFor="kelas_id" value="Kelas ID" />
                        {/* @ts-expect-error SelectDescription is intentionally untyped over its selection rows */}
                        <SelectDescription placeholder="Pilih Kelas" title={(value) => value?.nama} isLoading={isLoadingMentorDataList} description={(value) => value.tingkat} onChange={(value: unknown) => setKelasId(value)} keyValue={(value) => value.id} value={kelasId} error={errors.kelas_id} selection={kelasDataList} />
                        <Description value="" error={errors.kelas_id} />
                    </div>
                    
                    <div>
                        <Label htmlFor="tanggal" value="Tanggal" />
                        <InputDate value={tanggal ? moment(tanggal).toDate() : undefined} onChange={(value) => setTanggal(moment(value).format('Y-MM-DD'))} />
                        <Description value="" error={errors.tanggal} />
                    </div>

                    <div>
                        <Label htmlFor="waktu_mulai" value="Waktu Mulai" />
                        <Input
                            id="waktu_mulai"
                            type="time"
                            value={waktuMulai}
                            onChange={(e) => setWaktuMulai(e.target.value)}
                            error={errors.waktu_mulai}
                        />
                        <Description value="" error={errors.waktu_mulai} />
                    </div>

                    <div>
                        <Label htmlFor="waktu_selesai" value="Waktu Selesai" />
                        <Input
                            id="waktu_selesai"
                            type="time"
                            value={waktuSelesai}
                            onChange={(e) => setWaktuSelesai(e.target.value)}
                            error={errors.waktu_selesai}
                        />
                        <Description value="" error={errors.waktu_selesai} />
                    </div>

                    <div className="sm:col-span-2">
                        <Label htmlFor="materi" value="Materi" />
                        <Input
                            id="materi"
                            placeholder="Materi yang akan diajarkan"
                            value={materi}
                            onChange={(e) => setMateri(e.target.value)}
                            error={errors.materi}
                        />
                        <Description value="" error={errors.materi} />
                    </div>
                </div>
            </FormSection>

            <div className="flex items-center justify-end text-sm">
                <PrimaryButton type="submit">Submit</PrimaryButton>
            </div>
        </form>
    )
}