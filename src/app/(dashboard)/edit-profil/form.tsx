"use client"

import { FormEvent, useState } from "react"

import PrimaryButton from "@/components/buttons/primary"
import Description from "@/components/forms/description"
import FormSection from "@/components/forms/form-section"
import Input from "@/components/forms/input"
import Label from "@/components/forms/label"
import { User } from "@/lib/types"

type Props = {
    data?: User
    isLoading?: boolean
    onSubmit: (value: Record<string, unknown>) => void
    errors: Record<string, string[]>
}

export default function Form({ data, onSubmit, errors }: Props) {
    // ── User fields ───────────────────────────────────────────
    // Seeded straight from `data`. The caller keys this component on the record
    // id, so a freshly loaded profile remounts and re-seeds; a background SWR
    // revalidation of the same record no longer wipes what is being typed.
    const [name, setName] = useState<string>(data?.name ?? "")
    const [username, setUsername] = useState<string>(data?.username ?? "")
    const [email, setEmail] = useState<string>(data?.email ?? "")
    const [password, setPassword] = useState<string>("")
    const [passwordConfirmation, setPasswordConfirmation] = useState<string>("")
    const [localError, setLocalError] = useState<string | null>(null)

    const submitHandler = (e: FormEvent) => {
        e.preventDefault()

        if (password && password !== passwordConfirmation) {
            setLocalError('Konfirmasi password tidak cocok')
            return
        }

        setLocalError(null)
        onSubmit({
            // User
            name,
            username,
            email,
            password: password || undefined,
            password_confirmation: passwordConfirmation || undefined,
        })
    }

    return (
        <form className="space-y-6" onSubmit={submitHandler} method="POST">
            {/* Data Akun */}
            <FormSection title="Data Akun">
                <div className="grid gap-4 sm:grid-cols-2">
                    <div>
                        <Label htmlFor="name" value="Nama" />
                        <Input
                            id="name"
                            placeholder="Masukkan nama"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
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
                            onChange={(e) => setUsername(e.target.value)}
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
                            onChange={(e) => setEmail(e.target.value)}
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
                            onChange={(e) => setPassword(e.target.value)}
                            error={errors.password}
                        />
                        <Description value={data ? 'Kosongkan jika tidak ingin mengubah password.' : ''} error={errors.password}
                        />
                    </div>

                    <div>
                        <Label htmlFor="password_confirmation" value="Konfirmasi Password" />
                        <Input
                            id="password_confirmation"
                            type="password"
                            placeholder="Ulangi password"
                            value={passwordConfirmation}
                            onChange={(e) => setPasswordConfirmation(e.target.value)}
                            error={!!localError || !!errors.password_confirmation}
                        />
                        <Description
                            value=""
                            error={localError ? [localError] : errors.password_confirmation}
                        />
                    </div>
                </div>
            </FormSection>

            <div className="flex items-center justify-end text-sm">
                <PrimaryButton type="submit">Submit</PrimaryButton>
            </div>
        </form>
    )
}