"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import Image from "next/image"

import Input from "@/components/forms/input"
import Label from "@/components/forms/label"
import PrimaryButton from "@/components/buttons/primary"
import { Shield } from "@/components/icons/outline"
import { login } from "@/helpers/auth"
import LogoImage from "../../../../public/logo.png"

/** Flattens Laravel's 422 `errors` object into a list, and handles every other status. */
function toMessages(error: unknown): string[] {
    const response = (error as {
        response?: { status?: number; data?: { message?: string; errors?: Record<string, string[]> } }
    }).response

    if (!response) return ["Tidak dapat terhubung ke server. Periksa koneksi Anda."]
    if (response.status === 422 && response.data?.errors) {
        return Object.values(response.data.errors).flat()
    }
    if (response.status === 401) return ["Username/email atau password salah."]
    if (response.status === 403) return [response.data?.message ?? "Akun Anda tidak memiliki akses."]
    return [response.data?.message ?? "Terjadi kesalahan. Silakan coba lagi."]
}

export default function LoginPage() {
    const router = useRouter()

    const [username, setUsername] = useState("")
    const [password, setPassword] = useState("")
    const [errors, setErrors] = useState<string[]>([])
    const [isLoading, setIsLoading] = useState(false)

    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault()

        const nextErrors: string[] = []
        if (!username.trim()) nextErrors.push("Username/email tidak boleh kosong")
        if (!password.trim()) nextErrors.push("Password tidak boleh kosong")

        if (nextErrors.length > 0) {
            setErrors(nextErrors)
            return
        }

        setErrors([])
        setIsLoading(true)

        try {
            await login(username, password)
            router.push("/")
        } catch (error: unknown) {
            // A wrong password used to reach console.error only — the user saw nothing.
            setErrors(toMessages(error))
        } finally {
            setIsLoading(false)
        }
    }

    return (
        <div className="min-h-screen grid grid-cols-1 md:grid-cols-2">
            <div
                className="hidden md:flex items-center justify-center"
                style={{ background: "linear-gradient(-135deg, #F0F9FF 0%, #DFF2FE 50%, #74D4FF 100%)" }}
            >
                <Image src={LogoImage} alt="Logo Bimbel Smart" className="w-64 h-auto" priority />
            </div>

            <div className="flex items-center justify-center bg-neutral-50 p-6">
                <div className="max-w-md w-full bg-white border border-neutral-200 rounded-xl p-8">
                    <div className="md:hidden flex justify-center mb-6">
                        <Image src={LogoImage} alt="Logo Bimbel Smart" className="w-32 h-auto" priority />
                    </div>

                    <h1 className="text-xl font-bold text-center mb-1">Selamat datang!</h1>
                    <p className="text-center text-sm text-neutral-500 mb-6">
                        Silakan masuk untuk melanjutkan
                    </p>

                    {errors.length > 0 && (
                        <div role="alert" className="w-full bg-red-50 border border-red-200 text-red-600 text-sm px-4 py-3 rounded-xl mb-4">
                            <p className="font-semibold">Login gagal</p>
                            <ul className="mt-1 list-disc list-inside space-y-0.5">
                                {errors.map((message, index) => (
                                    <li key={index} className="text-xs leading-relaxed">{message}</li>
                                ))}
                            </ul>
                        </div>
                    )}

                    <form onSubmit={handleLogin} className="space-y-3">
                        <div>
                            <Label htmlFor="username" value="Username/Email" />
                            <Input
                                id="username"
                                placeholder="Masukkan username/email"
                                value={username}
                                onChange={(e) => setUsername(e.target.value)}
                                error={errors.length > 0}
                                disabled={isLoading}
                            />
                        </div>

                        <div>
                            <Label htmlFor="password" value="Password" />
                            <Input
                                id="password"
                                type="password"
                                placeholder="Masukkan password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                error={errors.length > 0}
                                disabled={isLoading}
                            />
                        </div>

                        <div className="pt-3">
                            <PrimaryButton
                                type="submit"
                                centerText
                                isLoading={isLoading}
                                disabled={isLoading}
                                className="w-full"
                                icon={<Shield className="w-5 h-5" />}
                            >
                                {isLoading ? "Memproses…" : "Masuk"}
                            </PrimaryButton>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    )
}
