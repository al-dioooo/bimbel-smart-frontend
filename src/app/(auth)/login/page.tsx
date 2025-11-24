"use client"

import { useState } from "react"
import Input from "@/components/forms/input"
import ErrorMessage from "@/components/forms/error-message"
import PrimaryButton from "@/components/buttons/primary"
import { login } from "@/helpers/auth"
import { useRouter } from "next/navigation"

export default function LoginPage() {
    const router = useRouter()

    const [username, setUsername] = useState("")
    const [password, setPassword] = useState("")
    const [errors, setErrors] = useState<string[]>([])

    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault()

        const newErrors = []
        if (!username.trim()) newErrors.push("Username/email tidak boleh kosong")
        if (!password.trim()) newErrors.push("Password tidak boleh kosong")

        if (newErrors.length > 0) {
            setErrors(newErrors)
            return
        }

        // Dummy login validation (mau cek warna)
        try {
            await login(username, password)
            router.push('/')
        } catch (error: any) {
            if (error.response?.status === 422) {
                setErrors(error.response.data.errors || {})
            } else {
                console.error("Login failed:", error)
            }
        } finally {
            // setIsLoading(false)
        }
    }

    return (
        <div className="min-h-screen grid grid-cols-1 md:grid-cols-2">
            <div
                className="flex items-center justify-center"
                style={{
                    background: 'linear-gradient(-135deg, #F0F9FF 0%, #DFF2FE 50%, #74D4FF 100%)'
                }}
            >
                <img
                    src="/logo.png"
                    alt="Logo Smart"
                    className="w-80"
                />
            </div>

            <div className="flex items-center justify-center bg-gray-50">
                <div className="w-[360px] bg-white border border-gray-100 rounded-2xl p-8 shadow-sm">

                    <h2 className="text-xl font-bold text-center mb-1">Selamat datang!</h2>
                    <p className="text-center text-sm text-neutral-600 mb-6">
                        Silahkan login untuk melanjutkan
                    </p>

                    {errors.length > 0 && (
                        <div className="w-full bg-red-50 border border-red-200 text-red-600 text-sm px-4 py-3 rounded-xl mb-4">
                            <p className="font-semibold flex items-center gap-2">
                                Login Gagal
                            </p>
                            <ErrorMessage error={errors} />
                        </div>
                    )}

                    {/* FORM */}
                    <form onSubmit={handleLogin}>

                        <label className="text-sm font-medium">Username/Email</label>
                        <Input
                            placeholder="Masukkan Username/Email"
                            id="username"
                            value={username}
                            onChange={(e) => setUsername(e.target.value)}
                            error={errors.length > 0}
                        />

                        <div className="mt-3">
                            <label className="text-sm font-medium">Password</label>
                            <Input
                                placeholder="Masukkan Password"
                                id="password"
                                type="password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                error={errors.length > 0}
                            />
                        </div>

                        <div className="mt-6 w-full">
                            <PrimaryButton
                                type="submit"
                                centerText
                                className="w-full"
                            >
                                Sign-in
                            </PrimaryButton>
                        </div>

                    </form>
                </div>
            </div>
        </div>
    )
}