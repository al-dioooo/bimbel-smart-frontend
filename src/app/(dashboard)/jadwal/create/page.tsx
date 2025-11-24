"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import api from "@/lib/axios"
import Form from "../form"

export default function CreateJadwal() {
    const router = useRouter()
    const [errors, setErrors] = useState<any>({})

    const submitHandler = (data: any) => {
        api
            .post("/jadwal", data)
            .then(() => {
                router.push("/jadwal")
            })
            .catch((error) => {
                if (error.response?.status === 422) {
                    setErrors(error.response.data.errors)
                }
            })
    }

    return (
        <div className="space-y-8">
            <h1 className="text-3xl font-semibold">Tambah Jadwal</h1>
            <Form onSubmit={submitHandler} errors={errors} />
        </div>
    )
}