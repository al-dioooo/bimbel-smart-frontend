"use client"

import { FormEvent, useState } from "react"

import PrimaryButton from "@/components/buttons/primary"
import Description from "@/components/forms/description"
import FormSection from "@/components/forms/form-section"
import Input from "@/components/forms/input"
import Label from "@/components/forms/label"
import Separator from "@/components/separator"
import SelectDescription from "@/components/forms/select-description"
import { useKelas } from "@/hooks/repositories/use-kelas"

type Siswa = {
    id: number
    nama: string
    kelas_id: number | null

    kontak?: string | null
    alamat?: string | null
    tempat_tanggal_lahir?: string | null
    asal_sekolah?: string | null
    nama_wali?: string | null
    kontak_wali?: string | null
    pekerjaan_wali?: string | null
    alamat_wali?: string | null
    tanggal_bergabung?: string | null
}

type Props = {
    data?: Siswa
    isLoading?: boolean
    onSubmit: (value: Record<string, unknown>) => void
    errors: Record<string, string[]>
}

export default function Form({ data, onSubmit, errors }: Props) {
    // Seeded straight from `data`. The caller keys this component on the record
    // id, so a freshly loaded record remounts and re-seeds; a background SWR
    // revalidation of the same record no longer wipes what is being typed.
    const [nama, setNama] = useState(data?.nama ?? "")
    const [kelasId, setKelasId] = useState<string>(
        data?.kelas_id !== null && data?.kelas_id !== undefined ? String(data.kelas_id) : ""
    )

    const [kontak, setKontak] = useState(data?.kontak ?? "")
    const [alamat, setAlamat] = useState(data?.alamat ?? "")
    const [tempatTanggalLahir, setTempatTanggalLahir] = useState(data?.tempat_tanggal_lahir ?? "")
    const [asalSekolah, setAsalSekolah] = useState(data?.asal_sekolah ?? "")

    const [namaWali, setNamaWali] = useState(data?.nama_wali ?? "")
    const [kontakWali, setKontakWali] = useState(data?.kontak_wali ?? "")
    const [pekerjaanWali, setPekerjaanWali] = useState(data?.pekerjaan_wali ?? "")
    const [alamatWali, setAlamatWali] = useState(data?.alamat_wali ?? "")

    const { data: kelasDataList, isLoading: isLoadingMentorDataList } = useKelas({
        paginate: false
    })

    const submitHandler = (e: FormEvent) => {
        e.preventDefault()

        onSubmit({
            nama,
            kelas_id: kelasId ? Number(kelasId) : null,

            kontak: kontak || null,
            alamat: alamat || null,
            tempat_tanggal_lahir: tempatTanggalLahir || null,
            asal_sekolah: asalSekolah || null,

            nama_wali: namaWali || null,
            kontak_wali: kontakWali || null,
            pekerjaan_wali: pekerjaanWali || null,
            alamat_wali: alamatWali || null,

        })
    }

    return (
        <form className="space-y-6" onSubmit={submitHandler} method="POST">
            {/* Data Siswa */}
            <FormSection title="Data Siswa">
                <div className="grid gap-4 sm:grid-cols-2">
                    <div>
                        <Label htmlFor="nama" value="Nama Siswa" />
                        <Input
                            id="nama"
                            placeholder="Masukkan nama siswa"
                            value={nama}
                            onChange={(e) => setNama(e.target.value)}
                            error={errors.nama}
                        />
                        <Description value="" error={errors.nama} />
                    </div>

                    <div>
                        <Label htmlFor="kontak" value="Kontak Siswa" />
                        <Input
                            id="kontak"
                            placeholder="Nomor HP / WhatsApp siswa"
                            value={kontak}
                            onChange={(e) => setKontak(e.target.value)}
                            error={errors.kontak}
                        />
                        <Description value="" error={errors.kontak} />
                    </div>

                    <div className="col-span-2">
                        <Label htmlFor="alamat" value="Alamat Siswa" />
                        <Input
                            id="alamat"
                            placeholder="Alamat rumah siswa"
                            value={alamat}
                            onChange={(e) => setAlamat(e.target.value)}
                            error={errors.alamat}
                        />
                        <Description value="" error={errors.alamat} />
                    </div>

                    <div>
                        <Label htmlFor="tempat_tanggal_lahir" value="Tempat, Tanggal Lahir" />
                        <Input
                            id="tempat_tanggal_lahir"
                            placeholder="Contoh: Bogor, 01 Januari 2010"
                            value={tempatTanggalLahir}
                            onChange={(e) => setTempatTanggalLahir(e.target.value)}
                            error={errors.tempat_tanggal_lahir}
                        />
                        <Description value="" error={errors.tempat_tanggal_lahir} />
                    </div>

                    <div>
                        <Label htmlFor="asal_sekolah" value="Asal Sekolah" />
                        <Input
                            id="asal_sekolah"
                            placeholder="Contoh: SMPN 1 Bogor"
                            value={asalSekolah}
                            onChange={(e) => setAsalSekolah(e.target.value)}
                            error={errors.asal_sekolah}
                        />
                        <Description value="" error={errors.asal_sekolah} />
                    </div>

                    <div>
                        <Label htmlFor="kelas_id" value="Kelas" />
                        {/* @ts-expect-error SelectDescription is intentionally untyped over its selection rows */}
                        <SelectDescription placeholder="Pilih Kelas" title={(value) => value?.nama} isLoading={isLoadingMentorDataList} description={(value) => value.tingkat} onChange={(value: unknown) => setKelasId(value)} keyValue={(value) => value.id} value={kelasId} error={errors.kelas_id} selection={kelasDataList} />
                        <Description value="" error={errors.kelas_id} />
                    </div>
                </div>
            </FormSection>

            <Separator />

            {/* Data Wali */}
            <FormSection title="Data Wali" description="Informasi orang tua / wali siswa.">
                <div className="grid gap-4 sm:grid-cols-2">
                    <div>
                        <Label htmlFor="nama_wali" value="Nama Wali" />
                        <Input
                            id="nama_wali"
                            placeholder="Nama orang tua / wali"
                            value={namaWali}
                            onChange={(e) => setNamaWali(e.target.value)}
                            error={errors.nama_wali}
                        />
                        <Description value="" error={errors.nama_wali} />
                    </div>

                    <div>
                        <Label htmlFor="kontak_wali" value="Kontak Wali" />
                        <Input
                            id="kontak_wali"
                            placeholder="Nomor HP / WhatsApp wali"
                            value={kontakWali}
                            onChange={(e) => setKontakWali(e.target.value)}
                            error={errors.kontak_wali}
                        />
                        <Description value="" error={errors.kontak_wali} />
                    </div>

                    <div>
                        <Label htmlFor="pekerjaan_wali" value="Pekerjaan Wali" />
                        <Input
                            id="pekerjaan_wali"
                            placeholder="Pekerjaan orang tua / wali"
                            value={pekerjaanWali}
                            onChange={(e) => setPekerjaanWali(e.target.value)}
                            error={errors.pekerjaan_wali}
                        />
                        <Description value="" error={errors.pekerjaan_wali} />
                    </div>

                    <div className="col-span-2">
                        <Label htmlFor="alamat_wali" value="Alamat Wali" />
                        <Input
                            id="alamat_wali"
                            placeholder="Alamat tempat tinggal wali"
                            value={alamatWali}
                            onChange={(e) => setAlamatWali(e.target.value)}
                            error={errors.alamat_wali}
                        />
                        <Description value="" error={errors.alamat_wali} />
                    </div>
                </div>
            </FormSection>

            {/* <Separator /> */}

            {/* Tanggal Bergabung */}
            {/* <FormSection title="Status Keaktifan">
                <div className="grid gap-4 sm:grid-cols-2">
                    <div>
                        <Label htmlFor="tanggal_bergabung" value="Tanggal Bergabung" />
                        <Input
                            id="tanggal_bergabung"
                            type="date"
                            value={tanggalBergabung}
                            onChange={(e) => setTanggalBergabung(e.target.value)}
                            error={errors.tanggal_bergabung}
                        />
                        <Description value="" error={errors.tanggal_bergabung} />
                    </div>
                </div>
            </FormSection> */}

            <div className="flex items-center justify-end text-sm">
                <PrimaryButton type="submit">Submit</PrimaryButton>
            </div>
        </form>
    )
}