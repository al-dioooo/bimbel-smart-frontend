'use client'

import { useState, type FormEvent } from "react"
import { useRouter } from "next/navigation"
import { toast } from "sonner"
import { mutate } from "swr"

import PageHeader from "@/components/ui/page-header"
import PrimaryButton from "@/components/buttons/primary"
import OutlineButton from "@/components/buttons/outline"
import FormSection from "@/components/forms/form-section"
import Label from "@/components/forms/label"
import Input from "@/components/forms/input"
import Description from "@/components/forms/description"
import SelectDescription from "@/components/forms/select-description"

import { useAturanGaji } from "@/hooks/repositories/use-aturan-gaji"
import { useKelas } from "@/hooks/repositories/use-kelas"
import api from "@/lib/axios"
import { formatCurrency } from "@/lib/format"
import type { AturanGaji, Kelas } from "@/lib/types"

/**
 * UC-11 / REQ-053: the admin adds the tarif of a kelas. A kelas has one
 * aturan gaji, so the list only offers kelas that have none yet.
 */
export default function CreateAturanGajiPage() {
    const router = useRouter()

    const { data: kelasList, isLoading: isLoadingKelas } = useKelas({ paginate: false, order_by: 'nama', direction: 'asc' })
    const { data: aturanList, isLoading: isLoadingAturan } = useAturanGaji({ paginate: false })

    const [kelasId, setKelasId] = useState<number | null>(null)
    const [tarif, setTarif] = useState("")
    const [errors, setErrors] = useState<Record<string, string[]>>({})
    const [isSubmitting, setIsSubmitting] = useState(false)

    const taken = new Set(((aturanList as unknown as AturanGaji[]) ?? []).map((row) => row.kelas_id))
    const available = ((kelasList as unknown as Kelas[]) ?? []).filter((kelas) => !taken.has(kelas.id))
    const isLoading = isLoadingKelas || isLoadingAturan

    const submitHandler = async (e: FormEvent) => {
        e.preventDefault()
        setIsSubmitting(true)
        setErrors({})

        try {
            await api.post('/aturan-gaji', { kelas_id: kelasId, tarif: tarif === "" ? null : Number(tarif) })
            // The list would otherwise come back from the SWR cache without the new rule.
            await mutate((key) => Array.isArray(key) && key[0] === '/aturan-gaji')
            toast.success('Aturan gaji berhasil ditambahkan')
            router.push('/aturan-gaji')
        } catch (error: unknown) {
            const response = (error as { response?: { status?: number; data?: { message?: string; errors?: Record<string, string[]> } } }).response
            if (response?.status === 422) setErrors(response.data?.errors ?? {})
            else toast.error(response?.data?.message ?? 'Gagal menambahkan aturan gaji')
        } finally {
            setIsSubmitting(false)
        }
    }

    return (
        <div className="space-y-8">
            <PageHeader title="Tambah Aturan Gaji" description="Tarif yang dibayarkan ke mentor untuk setiap kehadiran siswa di sebuah kelas." />

            <form className="space-y-6" onSubmit={submitHandler}>
                <FormSection title="Aturan" description="Satu kelas memiliki satu tarif. Kelas yang sudah memiliki aturan tidak ditampilkan.">
                    <div className="grid gap-4 sm:grid-cols-2">
                        <div>
                            <Label htmlFor="kelas" value="Kelas" />
                            <SelectDescription
                                title={(row: Kelas) => row?.nama}
                                description={(row: Kelas) => row?.tingkat}
                                keyValue={(row: Kelas) => row?.id}
                                selection={available}
                                isLoading={isLoading}
                                placeholder={available.length || isLoading ? "Pilih kelas" : "Semua kelas sudah memiliki aturan"}
                                value={kelasId ?? ''}
                                onChange={(value) => {
                                    setKelasId(value ? Number(value) : null)
                                    setErrors((current) => ({ ...current, kelas_id: [] }))
                                }}
                                error={errors.kelas_id}
                            />
                            <Description error={errors.kelas_id} />
                        </div>

                        <div>
                            <Label htmlFor="tarif" value="Tarif per Kehadiran" />
                            <Input
                                id="tarif"
                                type="number"
                                min={0}
                                placeholder="30000"
                                value={tarif}
                                onChange={(e) => {
                                    setTarif(e.target.value)
                                    setErrors((current) => ({ ...current, tarif: [] }))
                                }}
                                error={!!errors.tarif?.length}
                            />
                            <Description value={tarif ? formatCurrency(Number(tarif)) : ''} error={errors.tarif} />
                        </div>
                    </div>
                </FormSection>

                <div className="flex items-center justify-end gap-2 text-sm">
                    <OutlineButton type="button" buttonType="secondary" onClick={() => router.push('/aturan-gaji')}>
                        Batal
                    </OutlineButton>
                    <PrimaryButton type="submit" isLoading={isSubmitting} disabled={isSubmitting}>
                        Simpan
                    </PrimaryButton>
                </div>
            </form>
        </div>
    )
}
