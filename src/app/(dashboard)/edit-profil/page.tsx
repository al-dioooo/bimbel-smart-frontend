'use client'

import api from "@/lib/axios"
import { useRouter } from "next/navigation"
import { useState } from "react"
import Form from "./form"
import { useUser } from "@/hooks/use-user"

type ApiError = { response?: { status?: number; data?: { errors?: Record<string, string[]> } } }

export default function EditProfilPage() {
    const router = useRouter()

    const { user, mutateUser } = useUser()

    const [errors, setErrors] = useState<Record<string, string[]>>({})

    const submitHandler = (data: Record<string, unknown>) => {
        api.patch('/me/update', data).then(() => {
            mutateUser()
            router.push('/')
        }).catch((error: unknown) => {
            const response = (error as ApiError).response
            if (response?.status === 422) setErrors(response.data?.errors ?? {})
        })
    }

    return (
        <div className="space-y-8">
            {/* Title */}
            <h1 className="text-3xl font-semibold">Edit Profil</h1>
            <Form key={user?.id ?? 'loading'} data={user ?? undefined} onSubmit={submitHandler} errors={errors} />
        </div>
    )
}