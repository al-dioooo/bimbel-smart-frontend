"use client"

import { Suspense, useState } from "react"
import Link from "next/link"
import { useSearchParams } from "next/navigation"

import AuthShell from "@/components/auth-shell"
import Input from "@/components/forms/input"
import Label from "@/components/forms/label"
import Description from "@/components/forms/description"
import PrimaryButton from "@/components/buttons/primary"
import api from "@/lib/axios"

type ApiError = { response?: { status?: number; data?: { message?: string; errors?: Record<string, string[]> } } }

/**
 * REQ-015: the user sets a new password with the link (token and email in
 * the URL) or the code from the email.
 */
function ResetForm() {
    const params = useSearchParams()

    const [email, setEmail] = useState(params.get("email") ?? "")
    const [token, setToken] = useState(params.get("token") ?? "")
    const [password, setPassword] = useState("")
    const [confirmation, setConfirmation] = useState("")
    const [errors, setErrors] = useState<Record<string, string[]>>({})
    const [done, setDone] = useState<string | null>(null)
    const [isLoading, setIsLoading] = useState(false)
    const fromLink = !!params.get("token")

    const submit = async (e: React.FormEvent) => {
        e.preventDefault()
        setErrors({})
        setIsLoading(true)
        try {
            const { data } = await api.post("/reset-password", {
                email: email.trim(),
                token: token.trim(),
                password,
                password_confirmation: confirmation,
            })
            setDone(data?.message ?? "Kata sandi berhasil diatur ulang.")
        } catch (error: unknown) {
            const response = (error as ApiError).response
            if (response?.status === 422) setErrors(response.data?.errors ?? {})
            else setErrors({ form: [response?.data?.message ?? "Terjadi kesalahan. Silakan coba lagi."] })
        } finally {
            setIsLoading(false)
        }
    }

    if (done) {
        return (
            <div className="space-y-4">
                <div role="status" className="rounded-xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm text-emerald-700">{done}</div>
                <PrimaryButton as={Link} href="/login" centerText className="w-full">Masuk</PrimaryButton>
            </div>
        )
    }

    return (
        <form onSubmit={submit} className="space-y-3">
            {errors.form && (
                <div role="alert" className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-600">{errors.form[0]}</div>
            )}

            <div>
                <Label htmlFor="email" value="Email" />
                <Input id="email" type="email" placeholder="nama@contoh.com" value={email} onChange={(e) => setEmail(e.target.value)} error={errors.email} disabled={isLoading} />
                <Description error={errors.email} />
            </div>

            {!fromLink && (
                <div>
                    <Label htmlFor="token" value="Kode Reset" />
                    <Input id="token" placeholder="Salin kode dari email" value={token} onChange={(e) => setToken(e.target.value)} error={errors.token} disabled={isLoading} />
                    <Description error={errors.token} />
                </div>
            )}
            {fromLink && errors.token && <Description error={errors.token} />}

            <div>
                <Label htmlFor="password" value="Kata Sandi Baru" />
                <Input id="password" type="password" placeholder="Minimal 8 karakter" value={password} onChange={(e) => setPassword(e.target.value)} error={errors.password} disabled={isLoading} />
                <Description error={errors.password} />
            </div>

            <div>
                <Label htmlFor="password_confirmation" value="Konfirmasi Kata Sandi Baru" />
                <Input id="password_confirmation" type="password" placeholder="Ulangi kata sandi baru" value={confirmation} onChange={(e) => setConfirmation(e.target.value)} disabled={isLoading} />
            </div>

            <div className="pt-3">
                <PrimaryButton type="submit" centerText isLoading={isLoading} disabled={isLoading} className="w-full">
                    {isLoading ? "Menyimpan…" : "Simpan Kata Sandi Baru"}
                </PrimaryButton>
            </div>
        </form>
    )
}

export default function ResetPasswordPage() {
    return (
        <AuthShell title="Atur Ulang Kata Sandi" subtitle="Buat kata sandi baru untuk akun Anda.">
            <Suspense fallback={null}>
                <ResetForm />
            </Suspense>
            <p className="mt-6 text-center text-sm">
                <Link href="/lupa-kata-sandi" className="font-semibold text-sky-500 hover:text-sky-600">Minta tautan baru</Link>
                <span className="mx-2 text-neutral-300">|</span>
                <Link href="/login" className="font-semibold text-sky-500 hover:text-sky-600">Kembali ke login</Link>
            </p>
        </AuthShell>
    )
}
