"use client"

import { use, useState } from "react"
import { useRouter } from "next/navigation"
import api from "@/lib/axios"
import Form from "../../form"
import { useJadwalById } from "@/hooks/repositories/use-jadwal"

type ApiError = { response?: { status?: number; data?: { errors?: Record<string, string[]> } } }

export default function EditJadwal({ params }: { params: Promise<{ id: string }> }) {
    const router = useRouter()

    const { id } = use(params)

    // Was a hand-rolled fetch effect; every other detail page in the app goes
    // through the SWR repository hooks, which also gives caching and revalidation.
    const { data, isLoading } = useJadwalById(Number(id))

    const [errors, setErrors] = useState<Record<string, string[]>>({})

    const submitHandler = (payload: Record<string, unknown>) => {
        api
            .patch(`/jadwal/${id}`, payload)
            .then(() => {
                router.push("/jadwal")
            })
            .catch((error: unknown) => {
                const response = (error as ApiError).response
                if (response?.status === 422) setErrors(response.data?.errors ?? {})
            })
    }

    return (
        <div className="space-y-8">
            <h1 className="text-3xl font-semibold">Edit Jadwal</h1>
            <Form key={data?.id ?? 'loading'} data={data} isLoading={isLoading} onSubmit={submitHandler} errors={errors} />
        </div>
    )
}