'use client'

import api from "@/lib/axios"
import { useRouter } from "next/navigation"
import { useState } from "react"
import Form from "../form"

export default function CreateKelas() {
    const router = useRouter()

    const [errors, setErrors] = useState<any>({})

    const submitHandler = (data: any) => {
        api.post('/kelas', data).then(() => {
            router.push('/data/kelas')
        }).catch(err => {
            if (err.response?.status === 422) {
                setErrors(err.response.data.errors)
            }
        })
    }

    return (
        <div className="space-y-8">
            {/* Title */}
            <h1 className="text-3xl font-semibold">Tambah Data Kelas</h1>
            <Form onSubmit={submitHandler} errors={errors} />
        </div>
    )
}