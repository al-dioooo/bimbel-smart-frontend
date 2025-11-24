'use client'

import api from "@/lib/axios"
import { useRouter } from "next/navigation"
import { use, useState } from "react"
import Form from "../../form"
import { useMentorById } from "@/hooks/repositories/use-mentor"

export default function EditMentor({ params }: { params: Promise<{ id: string }> }) {
    const router = useRouter()

    const { id } = use(params)

    const { data, mutate, isLoading } = useMentorById(parseInt(id))

    const [errors, setErrors] = useState<any>({})

    const submitHandler = (data: any) => {
        api.patch(`/mentor/${id}`, data).then(() => {
            mutate(data)
            router.push('/data/mentor')
        }).catch((error) => {
            if (error.response?.status === 422) {
                setErrors(error.response.data.errors)
            }
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