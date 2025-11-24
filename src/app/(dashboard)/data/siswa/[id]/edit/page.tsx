"use client"

import { use, useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import api from "@/lib/axios"
import Form from "../../form"
import { Siswa } from "@/lib/types"

export default function EditSiswa({ params }: { params: Promise<{ id: string }> }) {
    const router = useRouter()

    const { id } = use(params)

    const [data, setData] = useState<Siswa | undefined>()
    const [isLoading, setIsLoading] = useState<boolean>(true)
    const [errors, setErrors] = useState<any>({})

    useEffect(() => {
        if (!id) return

        setIsLoading(true)

        api
            .get(`/siswa/${id}`)
            .then((res) => {
                // sesuaikan dengan bentuk response API (data.data atau data langsung)
                const payload = (res.data?.data ?? res.data) as Siswa
                setData(payload)
            })
            .finally(() => setIsLoading(false))
    }, [id])

    const submitHandler = (payload: any) => {
        api
            .patch(`/siswa/${id}`, payload)
            .then(() => {
                router.push("/data/siswa")
            })
            .catch((error) => {
                if (error.response?.status === 422) {
                    setErrors(error.response.data.errors)
                }
            })
    }

    return (
        <div className="space-y-8">
            <h1 className="text-3xl font-semibold">Edit Data Siswa</h1>
            <Form data={data} isLoading={isLoading} onSubmit={submitHandler} errors={errors} />
        </div>
    )
}