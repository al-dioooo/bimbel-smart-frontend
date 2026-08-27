'use client'

import api from "@/lib/axios"
import { useRouter } from "next/navigation"
import { use, useState } from "react"
import Form from "../../form"
import { useMentorById } from "@/hooks/repositories/use-mentor"

type ApiError = { response?: { status?: number; data?: { errors?: Record<string, string[]> } } }

export default function EditMentor({ params }: { params: Promise<{ id: string }> }) {
    const router = useRouter()

    const { id } = use(params)

    const { data, mutate, isLoading } = useMentorById(parseInt(id))

    const [errors, setErrors] = useState<Record<string, string[]>>({})

    const submitHandler = (data: Record<string, unknown>) => {
        api.patch(`/mentor/${id}`, data).then(() => {
            // Revalidate from the server rather than writing the partial payload in.
            mutate()
            router.push('/data/mentor')
        }).catch((error: unknown) => {
            const response = (error as ApiError).response
            if (response?.status === 422) setErrors(response.data?.errors ?? {})
        })
    }

    return (
        <div className="space-y-8">
            {/* Title */}
            <h1 className="text-3xl font-semibold">Edit Data Mentor</h1>
            {/* Form */}
            <Form data={data} isLoading={isLoading} onSubmit={submitHandler} errors={errors} />
        </div>
    )
}