"use client"

import { FormEvent, useEffect, useState } from "react"

import PrimaryButton from "@/components/buttons/primary"
import Description from "@/components/forms/description"
import FormSection from "@/components/forms/form-section"
import Input from "@/components/forms/input"
import Label from "@/components/forms/label"
import Separator from "@/components/separator"
import { useKelas } from "@/hooks/repositories/use-kelas"
import SelectDescription from "@/components/forms/select-description"
import InputDate from "@/components/forms/input-date"
import moment from "moment"

type Jadwal = {
    id: number
    kelas_id: number | null
    mentor_id: number | null

    tanggal?: string | null      // YYYY-MM-DD
    waktu_mulai?: string | null  // HH:MM
    waktu_selesai?: string | null
    materi?: string | null
}

type Props = {
    data?: Jadwal
    isLoading?: boolean
    onSubmit: (value: any) => void
    errors: any
}

export default function Form({ data, isLoading = false, onSubmit, errors }: Props) {
    const [kelasId, setKelasId] = useState<any>("")

    const [tanggal, setTanggal] = useState<string>("")
    const [waktuMulai, setWaktuMulai] = useState<string>("")
    const [waktuSelesai, setWaktuSelesai] = useState<string>("")
    const [materi, setMateri] = useState<string>("")

    const { data: kelasDataList, isLoading: isLoadingMentorDataList } = useKelas({
        paginate: false
    })

    // Prefill saat edit
    useEffect(() => {
        if (!data || isLoading) return

        setKelasId(data.kelas_id ?? "")

        setTanggal(data.tanggal ?? "")
        setWaktuMulai(data.waktu_mulai ?? "")
        setWaktuSelesai(data.waktu_selesai ?? "")
        setMateri(data.materi ?? "")
    }, [data, isLoading])

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
                        {/* @ts-expect-error */}
                        <SelectDescription placeholder="Pilih Kelas" title={(value) => value?.nama} isLoading={isLoadingMentorDataList} description={(value) => value.tingkat} onChange={(value: any) => setKelasId(value)} keyValue={(value) => value.id} value={kelasId} error={errors.kelas_id} selection={kelasDataList} />
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
                            onChange={(e: any) => setWaktuMulai(e.target.value)}
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
                            onChange={(e: any) => setWaktuSelesai(e.target.value)}
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
                            onChange={(e: any) => setMateri(e.target.value)}
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