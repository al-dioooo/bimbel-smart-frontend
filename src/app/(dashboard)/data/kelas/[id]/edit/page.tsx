'use client'

import api from "@/lib/axios"
import { useRouter } from "next/navigation"
import { use, useState } from "react"
import Form from "../../form"
import { useKelasById } from "@/hooks/repositories/use-kelas"

export default function EditKelas({ params }: { params: Promise<{ id: string }> }) {
    const router = useRouter()

    const { id } = use(params)

    const { data, mutate, isLoading } = useKelasById(parseInt(id))

    const [errors, setErrors] = useState<any>({})

    const submitHandler = (data: any) => {
        api.patch(`/kelas/${id}`, data).then(() => {
            mutate(data)
            router.push('/data/kelas')
        }).catch((error) => {
            if (error.response?.status === 422) {
                setErrors(error.response.data.errors)
            }
        })
    }

    return (
        <div className="space-y-8">
            {/* Title */}
            <h1 className="text-3xl font-semibold">Edit Data Kelas</h1>
            {/* Form */}
            <Form data={data} isLoading={isLoading} onSubmit={submitHandler} errors={errors} />
        </div>
    )
}