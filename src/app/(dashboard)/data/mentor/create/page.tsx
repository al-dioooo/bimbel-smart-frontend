'use client'

import api from "@/lib/axios"
import { useRouter } from "next/navigation"
import { useState } from "react"
import Form from "../form"

export default function CreateMentor() {
    const router = useRouter()
    const [errors, setErrors] = useState<any>({})

    const submitHandler = (data: any) => {
        api
            .post("/mentor", data)
            .then(() => {
                router.push("/data/mentor")
            })
            .catch((error) => {
                if (error.response?.status === 422) {
                    setErrors(error.response.data.errors)
                }
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