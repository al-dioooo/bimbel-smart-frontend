"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import api from "@/lib/axios"
import Form from "../form"

type ApiError = { response?: { status?: number; data?: { errors?: Record<string, string[]> } } }

export default function CreateSiswa() {
    const router = useRouter()
    const [errors, setErrors] = useState<Record<string, string[]>>({})

    const submitHandler = (data: Record<string, unknown>) => {
        api
            .post("/siswa", data) // sesuaikan dengan endpoint API kamu
            .then(() => {
                router.push("/data/siswa")
            })
            .catch((error: unknown) => {
                const response = (error as ApiError).response
                if (response?.status === 422) setErrors(response.data?.errors ?? {})
            })
    }

    return (
        <div className="space-y-8">
            <h1 className="text-3xl font-semibold">Tambah Data Siswa</h1>
            <Form onSubmit={submitHandler} errors={errors} />
        </div>
    )
}