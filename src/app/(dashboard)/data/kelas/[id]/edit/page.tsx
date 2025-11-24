'use client'

import PrimaryButton from "@/components/buttons/primary"
import Description from "@/components/forms/description"
import FormSection from "@/components/forms/form-section"
import Input from "@/components/forms/input"
import Label from "@/components/forms/label"
import Separator from "@/components/separator"
import api from "@/lib/axios"
import { useRouter } from "next/navigation"
import { FormEvent, useState } from "react"

export default function EditKelas() {
    const router = useRouter()

    const [errors, setErrors] = useState<any>({})

    const [nama, setNama] = useState<string>("")
    const [tingkat, setTingkat] = useState<string>("")

    const submitHandler = (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault()

        const data = {
            nama,
            tingkat
        }

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
            <h1 className="text-3xl font-semibold">Edit Data Kelas</h1>
            <form className="space-y-6" onSubmit={submitHandler} method="POST">
                <FormSection title="Kelas">
                    <div className="grid gap-4 sm:grid-cols-2">
                        <div>
                            <Label htmlFor="nama" value="Name" />
                            <Input placeholder="Kelas 7" onChange={(e: any) => setNama(e.target.value)} value={nama} id="nama" error={errors.nama} />
                            <Description error={errors.nama} />
                        </div>
                        <div>
                            <Label htmlFor="tingkat" value="Tingkat" />
                            <Input placeholder="7" onChange={(e: any) => setTingkat(e.target.value)} value={tingkat} id="tingkat" error={errors.tingkat} />
                            <Description error={errors.tingkat} />
                        </div>
                    </div>
                </FormSection>

                <Separator />

                <div className="flex items-center justify-end text-sm">
                    <PrimaryButton type="submit">Submit</PrimaryButton>
                </div>
            </form>
        </div>
    )
}