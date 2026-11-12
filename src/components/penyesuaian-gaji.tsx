'use client'

import { useState } from 'react'
import { toast } from 'sonner'

import Modal from '@/components/modal'
import PrimaryButton from '@/components/buttons/primary'
import OutlineButton from '@/components/buttons/outline'
import ConfirmDialog from '@/components/data/confirm-dialog'
import Label from '@/components/forms/label'
import Input from '@/components/forms/input'
import Description from '@/components/forms/description'
import SelectDescription from '@/components/forms/select-description'
import { CircleDashedPlus, Pencil, Trash } from '@/components/icons/outline'

import { usePenyesuaianGaji } from '@/hooks/repositories/use-gaji'
import { useMentor } from '@/hooks/repositories/use-mentor'
import api from '@/lib/axios'
import { formatCurrency } from '@/lib/format'
import { toneClasses } from '@/lib/status'
import { cn } from '@/lib/utils'
import type { JenisPenyesuaian, Mentor, PenyesuaianGaji } from '@/lib/types'

type Props = {
    bulan: string
    label: string
    /** A finalized month is read-only (UC-10 step 9). */
    locked: boolean
    /** Refresh the payroll preview after a change. */
    onChanged: () => void | Promise<unknown>
}

type ApiError = { response?: { status?: number; data?: { message?: string; errors?: Record<string, string[]> } } }

/**
 * REQ-064 / UC-10 step 5: manual bonus and potongan per mentor for the
 * month on screen. They are part of the draft until the month is finalized.
 */
export default function PenyesuaianGajiSection({ bulan, label, locked, onChanged }: Props) {
    const { data, isLoading, mutate } = usePenyesuaianGaji(bulan)
    const [editing, setEditing] = useState<PenyesuaianGaji | 'new' | null>(null)
    const [removing, setRemoving] = useState<PenyesuaianGaji | null>(null)

    const refresh = async () => {
        await mutate()
        await onChanged()
    }

    const remove = async () => {
        if (!removing) return
        try {
            await api.delete(`/penyesuaian-gaji/${removing.id}`)
            toast.success('Penyesuaian gaji berhasil dihapus')
            await refresh()
        } catch (err: unknown) {
            toast.error((err as ApiError).response?.data?.message ?? 'Gagal menghapus penyesuaian')
            throw err
        }
    }

    const rows = data ?? []

    return (
        <section className="space-y-3">
            <div className="flex flex-wrap items-center justify-between gap-2">
                <div>
                    <h2 className="text-lg font-semibold">Bonus dan Potongan</h2>
                    <p className="text-xs text-neutral-500">Penyesuaian manual untuk periode {label}, dihitung dalam gaji dan slip.</p>
                </div>
                {!locked && (
                    <OutlineButton type="button" onClick={() => setEditing('new')} className="text-xs" icon={<CircleDashedPlus className="w-5 h-5" />}>
                        Tambah Penyesuaian
                    </OutlineButton>
                )}
            </div>

            <div className="overflow-x-auto rounded-xl border border-neutral-200 bg-white">
                <table className="min-w-full divide-y divide-neutral-200 text-xs">
                    <thead className="bg-neutral-50 text-left uppercase text-neutral-500">
                        <tr>
                            <th className="px-6 py-3 font-medium">Guru/Mentor</th>
                            <th className="px-6 py-3 font-medium">Jenis</th>
                            <th className="px-6 py-3 font-medium">Keterangan</th>
                            <th className="px-6 py-3 font-medium text-right">Nominal</th>
                            {!locked && <th className="px-6 py-3"><span className="sr-only">Aksi</span></th>}
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-neutral-200 text-neutral-600">
                        {isLoading && <tr><td colSpan={5} className="px-6 py-4 text-center text-neutral-500">Memuat penyesuaian…</td></tr>}
                        {!isLoading && rows.length === 0 && (
                            <tr><td colSpan={5} className="px-6 py-4 text-center text-neutral-500">Belum ada bonus atau potongan pada periode ini.</td></tr>
                        )}
                        {rows.map((row) => (
                            <tr key={row.id}>
                                <td className="px-6 py-3 font-medium text-neutral-900">{row.mentor?.user?.name ?? '-'}</td>
                                <td className="px-6 py-3">
                                    <span className={cn('rounded-full border px-2 py-0.5 font-semibold', row.jenis === 'bonus' ? toneClasses.success : toneClasses.danger)}>
                                        {row.jenis === 'bonus' ? 'Bonus' : 'Potongan'}
                                    </span>
                                </td>
                                <td className="px-6 py-3">{row.keterangan || '-'}</td>
                                <td className={cn('px-6 py-3 text-right font-medium', row.jenis === 'bonus' ? 'text-emerald-600' : 'text-red-600')}>
                                    {row.jenis === 'bonus' ? '+' : '−'}{formatCurrency(row.nominal)}
                                </td>
                                {!locked && (
                                    <td className="px-6 py-3 text-right">
                                        <div className="inline-flex gap-1">
                                            <button type="button" onClick={() => setEditing(row)} aria-label={`Ubah penyesuaian ${row.mentor?.user?.name ?? ''}`} className="rounded-lg p-1.5 hover:bg-neutral-100">
                                                <Pencil className="h-4 w-4" />
                                            </button>
                                            <button type="button" onClick={() => setRemoving(row)} aria-label={`Hapus penyesuaian ${row.mentor?.user?.name ?? ''}`} className="rounded-lg p-1.5 text-red-500 hover:bg-red-50">
                                                <Trash className="h-4 w-4" />
                                            </button>
                                        </div>
                                    </td>
                                )}
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            <Modal
                from="top"
                size="md"
                isOpen={editing !== null}
                onClose={() => setEditing(null)}
                title={editing === 'new' ? 'Tambah Penyesuaian' : 'Ubah Penyesuaian'}
                subtitle={`Periode ${label}`}
            >
                {editing !== null && (
                    <PenyesuaianForm
                        key={editing === 'new' ? 'new' : editing.id}
                        bulan={bulan}
                        initial={editing === 'new' ? null : editing}
                        onClose={() => setEditing(null)}
                        onSaved={refresh}
                    />
                )}
            </Modal>

            <ConfirmDialog
                isOpen={removing !== null}
                onClose={() => setRemoving(null)}
                onConfirm={remove}
                title="Hapus Penyesuaian"
                message={removing && <>Hapus {removing.jenis} {formatCurrency(removing.nominal)} untuk <span className="font-semibold">{removing.mentor?.user?.name}</span>?</>}
            />
        </section>
    )
}

function PenyesuaianForm({ bulan, initial, onClose, onSaved }: {
    bulan: string
    initial: PenyesuaianGaji | null
    onClose: () => void
    onSaved: () => Promise<void>
}) {
    const { data: mentorData, isLoading: isLoadingMentor } = useMentor({ paginate: false })
    const mentors = (mentorData as unknown as Mentor[]) ?? []

    const [mentorId, setMentorId] = useState<number | null>(initial?.mentor_id ?? null)
    const [jenis, setJenis] = useState<JenisPenyesuaian>(initial?.jenis ?? 'bonus')
    const [nominal, setNominal] = useState(initial ? String(initial.nominal) : '')
    const [keterangan, setKeterangan] = useState(initial?.keterangan ?? '')
    const [errors, setErrors] = useState<Record<string, string[]>>({})
    const [isSaving, setIsSaving] = useState(false)

    const submit = async (e: React.FormEvent) => {
        e.preventDefault()
        setIsSaving(true)
        setErrors({})
        const body = { mentor_id: mentorId, bulan, jenis, nominal: nominal === '' ? null : Number(nominal), keterangan: keterangan.trim() || null }

        try {
            if (initial) await api.put(`/penyesuaian-gaji/${initial.id}`, body)
            else await api.post('/penyesuaian-gaji', body)
            toast.success(initial ? 'Penyesuaian gaji berhasil diperbarui' : 'Penyesuaian gaji berhasil disimpan')
            await onSaved()
            onClose()
        } catch (err: unknown) {
            const response = (err as ApiError).response
            if (response?.status === 422) setErrors(response.data?.errors ?? {})
            else toast.error(response?.data?.message ?? 'Gagal menyimpan penyesuaian')
        } finally {
            setIsSaving(false)
        }
    }

    return (
        <form onSubmit={submit} className="mt-4 space-y-4">
            <div>
                <Label htmlFor="mentor" value="Guru/Mentor" />
                <SelectDescription
                    title={(row: Mentor) => row?.user?.name}
                    description={(row: Mentor) => row?.kontak}
                    keyValue={(row: Mentor) => row?.id}
                    selection={mentors}
                    isLoading={isLoadingMentor}
                    placeholder="Pilih mentor"
                    value={mentorId ?? ''}
                    onChange={(value) => setMentorId(value ? Number(value) : null)}
                    error={errors.mentor_id}
                />
                <Description error={errors.mentor_id} />
            </div>

            <fieldset>
                <legend className="mb-1 text-xs font-medium text-neutral-700">Jenis</legend>
                <div className="grid grid-cols-2 gap-2">
                    {(['bonus', 'potongan'] as const).map((value) => (
                        <label
                            key={value}
                            className={cn(
                                'flex cursor-pointer items-center justify-center rounded-xl border px-3 py-2 text-sm font-medium transition',
                                jenis === value
                                    ? (value === 'bonus' ? toneClasses.success : toneClasses.danger)
                                    : 'border-neutral-200 text-neutral-600 hover:bg-neutral-50'
                            )}
                        >
                            <input type="radio" name="jenis" value={value} checked={jenis === value} onChange={() => setJenis(value)} className="sr-only" />
                            {value === 'bonus' ? 'Bonus' : 'Potongan'}
                        </label>
                    ))}
                </div>
                <Description error={errors.jenis} />
            </fieldset>

            <div>
                <Label htmlFor="nominal" value="Nominal" />
                <Input id="nominal" type="number" min={1} placeholder="50000" value={nominal} onChange={(e) => setNominal(e.target.value)} error={errors.nominal} />
                <Description value={nominal ? formatCurrency(Number(nominal)) : ''} error={errors.nominal} />
            </div>

            <div>
                <Label htmlFor="keterangan" value="Keterangan (opsional)" />
                <Input id="keterangan" maxLength={255} placeholder="Contoh: lembur persiapan ujian" value={keterangan} onChange={(e) => setKeterangan(e.target.value)} error={errors.keterangan} />
                <Description error={errors.keterangan ?? errors.bulan} />
            </div>

            <div className="flex items-center justify-end gap-2 text-sm">
                <OutlineButton type="button" buttonType="secondary" onClick={onClose} disabled={isSaving}>Batal</OutlineButton>
                <PrimaryButton type="submit" isLoading={isSaving} disabled={isSaving}>Simpan</PrimaryButton>
            </div>
        </form>
    )
}
