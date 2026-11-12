"use client"

import { useState } from "react"
import Link from "next/link"

import AuthShell from "@/components/auth-shell"
import Input from "@/components/forms/input"
import Label from "@/components/forms/label"
import Description from "@/components/forms/description"
import PrimaryButton from "@/components/buttons/primary"
import api from "@/lib/axios"

type ApiError = { response?: { status?: number; data?: { message?: string; errors?: Record<string, string[]> } } }

/**
 * REQ-012–REQ-014, REQ-018: the user asks for a reset link with their
 * registered email and is told it was sent (or why not).
 */
export default function LupaKataSandiPage() {
    const [email, setEmail] = useState("")
    const [errors, setErrors] = useState<string[]>([])
    const [sent, setSent] = useState<string | null>(null)
    const [isLoading, setIsLoading] = useState(false)

    const submit = async (e: React.FormEvent) => {
        e.preventDefault()
        setErrors([])
        if (!email.trim()) {
            setErrors(["Email wajib diisi."])
            return
        }

        setIsLoading(true)
        try {
            const { data } = await api.post("/forgot-password", { email: email.trim() })
            setSent(data?.message ?? "Tautan reset telah dikirim ke email Anda.")
        } catch (error: unknown) {
            const response = (error as ApiError).response
            if (!response) setErrors(["Tidak dapat terhubung ke server. Periksa koneksi Anda."])
            else setErrors(response.data?.errors?.email ?? [response.data?.message ?? "Terjadi kesalahan. Silakan coba lagi."])
        } finally {
            setIsLoading(false)
        }
    }

    return (
        <AuthShell title="Lupa Kata Sandi" subtitle="Masukkan email akun Anda untuk menerima tautan atau kode reset kata sandi.">
            {sent ? (
                <div className="space-y-4">
                    <div role="status" className="rounded-xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm text-emerald-700">
                        {sent} Buka tautan pada email, atau masukkan kode reset di halaman atur ulang kata sandi.
                    </div>
                    <PrimaryButton as={Link} href={`/reset-password?email=${encodeURIComponent(email.trim())}`} centerText className="w-full">
                        Masukkan Kode Reset
                    </PrimaryButton>
                </div>
            ) : (
                <form onSubmit={submit} className="space-y-3">
                    <div>
                        <Label htmlFor="email" value="Email" />
                        <Input
                            id="email"
                            type="email"
                            placeholder="nama@contoh.com"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            error={errors}
                            disabled={isLoading}
                        />
                        <Description error={errors} />
                    </div>

                    <div className="pt-3">
                        <PrimaryButton type="submit" centerText isLoading={isLoading} disabled={isLoading} className="w-full">
                            {isLoading ? "Mengirim…" : "Kirim Tautan Reset"}
                        </PrimaryButton>
                    </div>
                </form>
            )}

            <p className="mt-6 text-center text-sm">
                <Link href="/login" className="font-semibold text-sky-500 hover:text-sky-600">Kembali ke halaman login</Link>
            </p>
        </AuthShell>
    )
}
