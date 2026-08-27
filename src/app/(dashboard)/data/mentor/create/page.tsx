'use client'

import api from "@/lib/axios"
import { useRouter } from "next/navigation"
import { useState } from "react"
import Form from "../form"

type ApiError = { response?: { status?: number; data?: { errors?: Record<string, string[]> } } }

export default function CreateMentor() {
    const router = useRouter()
    const [errors, setErrors] = useState<Record<string, string[]>>({})

    const submitHandler = (data: Record<string, unknown>) => {
        api
            .post("/mentor", data)
            .then(() => {
                router.push("/data/mentor")
            })
            .catch((error: unknown) => {
                const response = (error as ApiError).response
                if (response?.status === 422) setErrors(response.data?.errors ?? {})
            })
    }

    return (
        <div className="space-y-8">
            {/* Title */}
            <h1 className="text-3xl font-semibold">Tambah Data Mentor</h1>
            <Form onSubmit={submitHandler} errors={errors} />
        </div>
    )
}