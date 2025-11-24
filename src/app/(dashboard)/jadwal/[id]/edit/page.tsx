"use client"

import { use, useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import api from "@/lib/axios"
import Form from "../../form"

type Jadwal = {
    id: number
    kelas_id: number | null
    mentor_id: number | null

    tanggal?: string | null
    waktu_mulai?: string | null
    waktu_selesai?: string | null
    materi?: string | null
}

export default function EditJadwal({ params }: { params: Promise<{ id: string }> }) {
    const router = useRouter()

    const { id } = use(params)

    const [data, setData] = useState<Jadwal | undefined>()
    const [isLoading, setIsLoading] = useState<boolean>(true)
    const [errors, setErrors] = useState<any>({})

    useEffect(() => {
        if (!id) return

        setIsLoading(true)

        api
            .get(`/jadwal/${id}`)
            .then((res) => {
                const payload = (res.data?.data ?? res.data) as Jadwal
                setData(payload)
            })
            .finally(() => setIsLoading(false))
    }, [id])

    const submitHandler = (payload: any) => {
        api
            .patch(`/jadwal/${id}`, payload)
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
            <h1 className="text-3xl font-semibold">Edit Jadwal</h1>
            <Form data={data} isLoading={isLoading} onSubmit={submitHandler} errors={errors} />
        </div>
    )
}