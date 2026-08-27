'use client'

import { use, useEffect, useState, type FormEvent } from "react"
import { useRouter } from "next/navigation"
import { toast } from "sonner"

import PageHeader from "@/components/ui/page-header"
import PrimaryButton from "@/components/buttons/primary"
import OutlineButton from "@/components/buttons/outline"
import FormSection from "@/components/forms/form-section"
import Label from "@/components/forms/label"
import Input from "@/components/forms/input"
import Description from "@/components/forms/description"

import { useAturanGajiById } from "@/hooks/repositories/use-aturan-gaji"
import api from "@/lib/axios"
import { formatCurrency } from "@/lib/format"

export default function EditAturanGajiPage({ params }: { params: Promise<{ id: string }> }) {
    const router = useRouter()
    const { id } = use(params)

    const { data, isLoading, mutate } = useAturanGajiById(Number(id))

    const [tarif, setTarif] = useState<string>("")
    const [errors, setErrors] = useState<Record<string, string[]>>({})
    const [isSubmitting, setIsSubmitting] = useState(false)

    useEffect(() => {
        if (!data || isLoading) return
        setTarif(data.tarif != null ? String(data.tarif) : "")
    }, [data, isLoading])

    const submitHandler = async (e: FormEvent) => {
        e.preventDefault()
        setIsSubmitting(true)
        setErrors({})

        try {
            await api.patch(`/aturan-gaji/${id}`, { tarif: Number(tarif) })
            await mutate()
            toast.success('Aturan gaji berhasil diperbarui')
            router.push('/aturan-gaji')
        } catch (error: unknown) {
            const response = (error as { response?: { status?: number; data?: { errors?: Record<string, string[]> } } }).response
            if (response?.status === 422) setErrors(response.data?.errors ?? {})
            else toast.error('Gagal memperbarui aturan gaji')
        } finally {
            setIsSubmitting(false)
        }
    }

    return (
        <div className="space-y-8">
            <PageHeader
                title="Edit Aturan Gaji"
                description={data?.kelas?.nama ? `Kelas ${data.kelas.nama}` : undefined}
            />

            <form className="space-y-6" onSubmit={submitHandler}>
                <FormSection title="Tarif" description="Nominal yang dibayarkan untuk setiap kehadiran siswa di kelas ini.">
                    <div className="grid gap-4 sm:grid-cols-2">
                        <div>
                            <Label htmlFor="tarif" value="Tarif per Kehadiran" />
                            <Input
                                id="tarif"
                                type="number"
                                min={0}
                                placeholder="30000"
                                value={tarif}
                                disabled={isLoading}
                                onChange={(e) => setTarif(e.target.value)}
                                error={!!errors.tarif}
                            />
                            <Description
                                value={tarif ? formatCurrency(Number(tarif)) : ''}
                                error={errors.tarif}
                            />
                        </div>
                    </div>
                </FormSection>

                <div className="flex items-center justify-end gap-2 text-sm">
                    <OutlineButton type="button" buttonType="secondary" onClick={() => router.push('/aturan-gaji')}>
                        Batal
                    </OutlineButton>
                    <PrimaryButton type="submit" isLoading={isSubmitting} disabled={isSubmitting || isLoading}>
                        Simpan
                    </PrimaryButton>
                </div>
            </form>
        </div>
    )
}
