'use client'

import PrimaryButton from "@/components/buttons/primary"
import Description from "@/components/forms/description"
import FormSection from "@/components/forms/form-section"
import Input from "@/components/forms/input"
import Label from "@/components/forms/label"
import Separator from "@/components/separator"
import { useState } from "react"

export default function CreateKelas() {
    const [errors, setErrors] = useState<any>({})

    const [name, setName] = useState<string>("")
    const [tingkatan, setTingkatan] = useState<string>("")

    return (
        <div className="space-y-8">
            {/* Title */}
            <h1 className="text-3xl font-semibold">Tambah Data Kelas</h1>
            <form className="space-y-6">
                <FormSection title="Kelas">
                    <div className="grid gap-4 sm:grid-cols-2">
                        {/* <div className="col-span-2 sm:col-span-1">
                        <Label htmlFor="image" value="Image" />
                        <InputImage onChange={(value: any) => setImage(value)} aspect="square" id="image" name="image" src={data?.image} error={errors.image} alt="https://placehold.co/400x400/F5F5F5/404040?font=source-sans-pro&text=400x400" />
                        <ErrorMessage error={errors.image} />
                    </div> */}
                        <div>
                            <Label htmlFor="name" value="Name" />
                            <Input placeholder="Kelas 7" onChange={(e: any) => setName(e.target.value)} value={name} id="name" error={errors.name} />
                            <Description error={errors.name} />
                        </div>
                        <div>
                            <Label htmlFor="tingkatan" value="Tingkatan" />
                            <Input placeholder="7" onChange={(e: any) => setTingkatan(e.target.value)} value={tingkatan} id="tingkatan" error={errors.tingkatan} />
                            <Description error={errors.tingkatan} />
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