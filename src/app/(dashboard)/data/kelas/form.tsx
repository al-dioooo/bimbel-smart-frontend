import { FormEvent, useState } from "react"

import PrimaryButton from "@/components/buttons/primary"
import Description from "@/components/forms/description"
import FormSection from "@/components/forms/form-section"
import Input from "@/components/forms/input"
import Label from "@/components/forms/label"
import Separator from "@/components/separator"

type Props = {
    onSubmit: (value: any) => void
    errors: any
}

export default function Form({ onSubmit, errors }: Props) {
    const [nama, setNama] = useState<string>("")
    const [tingkat, setTingkat] = useState<string>("")

    const submitHandler = (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault()

        const data = {
            nama,
            tingkat
        }

        onSubmit(data)
    }

    return (
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
    )
}