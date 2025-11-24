"use client"

import { FormEvent, useEffect, useState } from "react"

import PrimaryButton from "@/components/buttons/primary"
import Description from "@/components/forms/description"
import FormSection from "@/components/forms/form-section"
import Input from "@/components/forms/input"
import Label from "@/components/forms/label"
import Separator from "@/components/separator"

// If you already have Mentor type in "@/lib/types", use that instead
// import { Mentor } from "@/lib/types"

type Mentor = {
    id: number
    name: string
    username: string
    email: string
    kontak?: string | null
    specialization?: string | null
    experience_years?: number | null
    bio?: string | null
}

type Props = {
    data?: Mentor
    isLoading?: boolean
    onSubmit: (value: any) => void
    errors: any
}

export default function Form({ data, isLoading = false, onSubmit, errors }: Props) {
    const [name, setName] = useState<string>("")
    const [username, setUsername] = useState<string>("")
    const [email, setEmail] = useState<string>("")
    const [kontak, setKontak] = useState<string>("")
    const [password, setPassword] = useState<string>("")
    const [passwordConfirmation, setPasswordConfirmation] = useState<string>("")

    const [specialization, setSpecialization] = useState<string>("")
    const [experienceYears, setExperienceYears] = useState<string>("")
    const [bio, setBio] = useState<string>("")

    // Populate form when editing (same pattern as Kelas form)
    useEffect(() => {
        if (data && !isLoading) {
            setName(data.name ?? "")
            setUsername(data.username ?? "")
            setEmail(data.email ?? "")
            setKontak(data.kontak ?? "")

            setSpecialization(data.specialization ?? "")
            setExperienceYears(
                data.experience_years != null ? String(data.experience_years) : ""
            )
            setBio(data.bio ?? "")
        }
    }, [data, isLoading])

    const submitHandler = (e: FormEvent) => {
        e.preventDefault()

        onSubmit({
            name,
            username,
            email,
            kontak: kontak || null,
            password: password || undefined,
            password_confirmation: passwordConfirmation || undefined,
            specialization: specialization || null,
            experience_years: experienceYears ? Number(experienceYears) : null,
            bio: bio || null,
        })
    }

    return (
        <form className="space-y-6" onSubmit={submitHandler} method="POST">
            <FormSection title="Data Utama">
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
                        <Label htmlFor="kontak" value="Kontak" />
                        <Input
                            id="kontak"
                            placeholder="Masukkan nomor kontak / WhatsApp"
                            value={kontak}
                            onChange={(e: any) => setKontak(e.target.value)}
                            error={errors.kontak}
                        />
                        <Description value="" error={errors.kontak} />
                    </div>
                </div>
            </FormSection>

            <Separator />

            <FormSection title="Keamanan">
                <div className="grid gap-4 sm:grid-cols-2">
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
                        <Description
                            value="Kosongkan jika tidak ingin mengubah password (saat edit)."
                            error={errors.password}
                        />
                    </div>

                    <div>
                        <Label htmlFor="password_confirmation" value="Konfirmasi Password" />
                        <Input
                            id="password_confirmation"
                            type="password"
                            placeholder="Ulangi password"
                            value={passwordConfirmation}
                            onChange={(e: any) => setPasswordConfirmation(e.target.value)}
                            error={errors.password_confirmation}
                        />
                        <Description value="" error={errors.password_confirmation} />
                    </div>
                </div>
            </FormSection>

            <Separator />

            <FormSection
                title="Detail Mentor"
                description="Informasi tambahan terkait keahlian mentor."
            >
                <div className="grid gap-4 sm:grid-cols-2">
                    <div>
                        <Label htmlFor="specialization" value="Spesialisasi" />
                        <Input
                            id="specialization"
                            placeholder="Contoh: Matematika, Fisika, Bahasa Inggris"
                            value={specialization}
                            onChange={(e: any) => setSpecialization(e.target.value)}
                            error={errors.specialization}
                        />
                        <Description value="" error={errors.specialization} />
                    </div>

                    <div>
                        <Label htmlFor="experience_years" value="Pengalaman (tahun)" />
                        <Input
                            id="experience_years"
                            type="number"
                            min={0}
                            placeholder="Contoh: 3"
                            value={experienceYears}
                            onChange={(e: any) => setExperienceYears(e.target.value)}
                            error={errors.experience_years}
                        />
                        <Description value="" error={errors.experience_years} />
                    </div>

                    <div className="sm:col-span-2">
                        <Label htmlFor="bio" value="Bio / Deskripsi" />
                        <Input
                            id="bio"
                            placeholder="Deskripsi singkat tentang mentor"
                            value={bio}
                            onChange={(e: any) => setBio(e.target.value)}
                            error={errors.bio}
                        />
                        <Description value="" error={errors.bio} />
                    </div>
                </div>
            </FormSection>

            <div className="flex items-center justify-end text-sm">
                <PrimaryButton type="submit">Submit</PrimaryButton>
            </div>
        </form>
    )
}