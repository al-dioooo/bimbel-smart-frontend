'use client'

import { useState } from 'react'
import moment from 'moment'
import { toast } from 'sonner'

import Modal from '@/components/modal'
import { CATATAN_MAX } from '@/components/absensi-action'
import PrimaryButton from '@/components/buttons/primary'
import OutlineButton from '@/components/buttons/outline'
import api from '@/lib/axios'
import { attendance, attendanceCodes, normalizeAttendance, toneClasses, type AttendanceCode } from '@/lib/status'
import { cn } from '@/lib/utils'
import type { Absensi, Jadwal, Siswa } from '@/lib/types'

export type EditTarget = { record: Absensi; jadwal: Jadwal; siswa: Siswa }

type Props = {
    target: EditTarget | null
    onClose: () => void
    onSaved: () => void | Promise<unknown>
}

/**
 * UC-09 "Mengedit Data Absensi": the admin corrects a recorded attendance.
 * Recording is insert-only, so this is the one place a status changes.
 */
export default function AbsensiEditDialog({ target, onClose, onSaved }: Props) {
    return (
        <Modal
            from="top"
            size="md"
            isOpen={target !== null}
            onClose={onClose}
            title="Ubah Absensi"
            subtitle={target ? `${target.siswa.nama}, ${moment(target.jadwal.tanggal as unknown as string).format('dddd, D MMMM YYYY')}` : undefined}
        >
            {/* Keyed by record so the form starts from that record's values. */}
            {target && <EditForm key={target.record.id} target={target} onClose={onClose} onSaved={onSaved} />}
        </Modal>
    )
}

function EditForm({ target, onClose, onSaved }: { target: EditTarget; onClose: () => void; onSaved: Props['onSaved'] }) {
    const [status, setStatus] = useState<AttendanceCode | null>(normalizeAttendance(target.record.status))
    const [catatan, setCatatan] = useState(target.record.catatan ?? '')
    const [error, setError] = useState<string | null>(null)
    const [isSaving, setIsSaving] = useState(false)

    const submit = async (e: React.FormEvent) => {
        e.preventDefault()
        if (!status) return

        setIsSaving(true)
        setError(null)
        try {
            // REQ-049: status and note; an emptied note is cleared.
            await api.put(`/absensi/${target.record.id}`, { status, catatan: catatan.trim() || null })
            toast.success('Data absensi berhasil diperbarui')
            await onSaved()
            onClose()
        } catch (err: unknown) {
            const data = (err as { response?: { data?: { message?: string } } }).response?.data
            setError(data?.message ?? 'Gagal memperbarui absensi')
        } finally {
            setIsSaving(false)
        }
    }

    return (
        <form onSubmit={submit} className="mt-4 space-y-5">
            <fieldset>
                <legend className="mb-2 text-sm font-medium text-neutral-700">Status kehadiran</legend>
                <div className="grid grid-cols-2 gap-2 sm:grid-cols-4">
                    {attendanceCodes.map((code) => (
                        <label
                            key={code}
                            className={cn(
                                'flex cursor-pointer items-center justify-center gap-2 rounded-xl border px-3 py-2 text-sm font-medium transition',
                                status === code ? toneClasses[attendance[code].tone] : 'border-neutral-200 text-neutral-600 hover:bg-neutral-50'
                            )}
                        >
                            <input
                                type="radio"
                                name="status"
                                value={code}
                                checked={status === code}
                                onChange={() => setStatus(code)}
                                className="sr-only"
                            />
                            {attendance[code].label}
                        </label>
                    ))}
                </div>
            </fieldset>

            <div>
                <label htmlFor="catatan" className="mb-2 block text-sm font-medium text-neutral-700">
                    Catatan <span className="font-normal text-neutral-400">(opsional)</span>
                </label>
                <textarea
                    id="catatan"
                    value={catatan}
                    maxLength={CATATAN_MAX}
                    rows={3}
                    onChange={(e) => setCatatan(e.target.value)}
                    placeholder="Contoh: salah input, seharusnya izin"
                    className="w-full rounded-xl border border-neutral-200 p-2 text-sm focus:border-neutral-400 focus:outline-none"
                />
                <p className="mt-1 text-right text-xs text-neutral-400">{catatan.length}/{CATATAN_MAX}</p>
            </div>

            {error && (
                <p role="alert" className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-600">
                    {error}
                </p>
            )}

            <div className="flex items-center justify-end gap-2 text-sm">
                <OutlineButton type="button" buttonType="secondary" onClick={onClose} disabled={isSaving}>
                    Batal
                </OutlineButton>
                <PrimaryButton type="submit" isLoading={isSaving} disabled={isSaving || !status}>
                    Simpan Perubahan
                </PrimaryButton>
            </div>
        </form>
    )
}
