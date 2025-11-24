"use client"

import { FormEvent, useEffect, useState } from "react"

import PrimaryButton from "@/components/buttons/primary"
import Description from "@/components/forms/description"
import FormSection from "@/components/forms/form-section"
import Input from "@/components/forms/input"
import Label from "@/components/forms/label"
import Separator from "@/components/separator"
import { Mentor } from "@/lib/types"

// Kalau kamu sudah punya type Mentor di "@/lib/types", pakai ini:
// import type { Mentor } from "@/lib/types"

type Props = {
    data?: Mentor
    isLoading?: boolean
    onSubmit: (value: any) => void
    errors: any
}

export default function Form({ data, isLoading = false, onSubmit, errors }: Props) {
    // ── User fields ───────────────────────────────────────────
    const [name, setName] = useState<string>("")
    const [username, setUsername] = useState<string>("")
    const [email, setEmail] = useState<string>("")
    const [password, setPassword] = useState<string>("")
    const [passwordConfirmation, setPasswordConfirmation] = useState<string>("")

    // ── Mentor fields (dari model Mentor.php) ────────────────
    const [tempatTanggalLahir, setTempatTanggalLahir] = useState<string>("")
    const [kontak, setKontak] = useState<string>("")
    const [nik, setNik] = useState<string>("")
    const [npwp, setNpwp] = useState<string>("")
    const [alamat, setAlamat] = useState<string>("")

    // Prefill kalau dipakai untuk edit
    useEffect(() => {
        if (!data || isLoading) return

        setName(data.user?.name ?? "")
        setUsername(data.user?.username ?? "")
        setEmail(data.user?.email ?? "")

        setTempatTanggalLahir(data.tempat_tanggal_lahir ?? "")
        setKontak(data.kontak ?? "")
        setNik(data.nik ?? "")
        setNpwp(data.npwp ?? "")
        setAlamat(data.alamat ?? "")
    }, [data, isLoading])

    const submitHandler = (e: FormEvent) => {
        e.preventDefault()

        onSubmit({
            // User
            name,
            username,
            email,
            password: password || undefined,
            password_confirmation: passwordConfirmation || undefined,

            // Mentor
            tempat_tanggal_lahir: tempatTanggalLahir || null,
            kontak: kontak || null,
            nik: nik || null,
            npwp: npwp || null,
            alamat: alamat || null,
        })
    }

    return (
        <form className="space-y-6" onSubmit={submitHandler} method="POST">
            {/* Data Akun */}
            <FormSection title="Data Akun">
                <div className="grid gap-4 sm:grid-cols-2">
                    <div>
                        <Label htmlFor="username" value="Username" />
                        <Input
                            id="username"
                            placeholder="Masukkan username"
                            value={username}
                            onChange={(e: any) => setUsername(e.target.value)}
                            error={errors.username}
                        />
                        <Description value="" error={errors.username} />
                    </div>

                    <div>
                        <Label htmlFor="email" value="Email" />
                        <Input
                            id="email"
                            type="email"
                            placeholder="Masukkan email"
                            value={email}
                            onChange={(e: any) => setEmail(e.target.value)}
                            error={errors.email}
                        />
                        <Description value="" error={errors.email} />
                    </div>

                    <div>
                        <Label htmlFor="password" value="Password" />
                        <Input
                            id="password"
                            type="password"
                            placeholder="Masukkan password"
                            value={password}
                            onChange={(e: any) => setPassword(e.target.value)}
                            error={errors.password}
                        />
                        <Description value={data ? 'Kosongkan jika tidak ingin mengubah password.' : ''} error={errors.password}
                        />
                    </div>
                </div>
            </FormSection>

            <Separator />

            {/* Data Mentor (sesuai model Mentor.php) */}
            <FormSection
                title="Data Utama"
                description="Lengkapi data mentor sesuai identitas dan kontak."
            >
                <div className="grid gap-4 sm:grid-cols-2">
                    <div>
                        <Label htmlFor="name" value="Nama" />
                        <Input
                            id="name"
                            placeholder="Masukkan nama mentor"
                            value={name}
                            onChange={(e: any) => setName(e.target.value)}
                            error={errors.name}
                        />
                        <Description value="" error={errors.name} />
                    </div>

                    <div>
                        <Label htmlFor="tempat_tanggal_lahir" value="Tempat, Tanggal Lahir" />
                        <Input
                            id="tempat_tanggal_lahir"
                            placeholder="Contoh: Bogor, 01 Januari 2000"
                            value={tempatTanggalLahir}
                            onChange={(e: any) => setTempatTanggalLahir(e.target.value)}
                            error={errors.tempat_tanggal_lahir}
                        />
                        <Description value="" error={errors.tempat_tanggal_lahir} />
                    </div>

                    <div>
                        <Label htmlFor="kontak" value="Kontak" />
                        <Input
                            id="kontak"
                            placeholder="Nomor HP / WhatsApp"
                            value={kontak}
                            onChange={(e: any) => setKontak(e.target.value)}
                            error={errors.kontak}
                        />
                        <Description value="" error={errors.kontak} />
                    </div>

                    <div>
                        <Label htmlFor="nik" value="NIK" />
                        <Input
                            id="nik"
                            placeholder="Nomor Induk Kependudukan"
                            value={nik}
                            onChange={(e: any) => setNik(e.target.value)}
                            error={errors.nik}
                        />
                        <Description value="" error={errors.nik} />
                    </div>

                    <div>
                        <Label htmlFor="npwp" value="NPWP" />
                        <Input
                            id="npwp"
                            placeholder="Nomor NPWP"
                            value={npwp}
                            onChange={(e: any) => setNpwp(e.target.value)}
                            error={errors.npwp}
                        />
                        <Description value="" error={errors.npwp} />
                    </div>

                    <div className="col-span-2">
                        <Label htmlFor="alamat" value="Alamat" />
                        <Input
                            id="alamat"
                            placeholder="Alamat"
                            value={alamat}
                            onChange={(e: any) => setAlamat(e.target.value)}
                            error={errors.alamat}
                        />
                        <Description value="" error={errors.alamat} />
                    </div>
                </div>
            </FormSection>

            <div className="flex items-center justify-end text-sm">
                <PrimaryButton type="submit">Submit</PrimaryButton>
            </div>
        </form>
    )
}