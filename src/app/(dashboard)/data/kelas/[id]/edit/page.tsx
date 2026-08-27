'use client'

import api from "@/lib/axios"
import { useRouter } from "next/navigation"
import { use, useState } from "react"
import Form from "../../form"
import { useKelasById } from "@/hooks/repositories/use-kelas"

type ApiError = { response?: { status?: number; data?: { errors?: Record<string, string[]> } } }

export default function EditKelas({ params }: { params: Promise<{ id: string }> }) {
    const router = useRouter()

    const { id } = use(params)

    const { data, mutate, isLoading } = useKelasById(parseInt(id))

    const [errors, setErrors] = useState<Record<string, string[]>>({})

    const submitHandler = (data: Record<string, unknown>) => {
        api.patch(`/kelas/${id}`, data).then(() => {
            // Revalidate from the server rather than writing the partial payload in.
            mutate()
            router.push('/data/kelas')
        }).catch((error: unknown) => {
            const response = (error as ApiError).response
            if (response?.status === 422) setErrors(response.data?.errors ?? {})
        })
    }

    return (
        <div className="space-y-8">
            {/* Title */}
            <h1 className="text-3xl font-semibold">Edit Data Kelas</h1>
            {/* Form */}
            <Form key={data?.id ?? 'loading'} data={data} isLoading={isLoading} onSubmit={submitHandler} errors={errors} />
        </div>
    )
}