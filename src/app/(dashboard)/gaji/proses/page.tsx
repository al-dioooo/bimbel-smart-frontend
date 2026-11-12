'use client'

import { Fragment, useState } from "react"
import moment from "moment"
import { toast } from "sonner"
import { mutate as mutateGlobal } from "swr"

import PageHeader from "@/components/ui/page-header"
import { Card } from "@/components/ui/card"
import PrimaryButton from "@/components/buttons/primary"
import OutlineButton from "@/components/buttons/outline"
import ConfirmDialog from "@/components/data/confirm-dialog"
import { Check, Pencil } from "@/components/icons/outline"

import { usePeriodeGaji } from "@/hooks/repositories/use-gaji"
import api from "@/lib/axios"
import { formatCurrency, formatNumber } from "@/lib/format"
import { toneClasses } from "@/lib/status"
import { cn } from "@/lib/utils"

const thisMonth = () => moment().format('YYYY-MM')

/**
 * UC-10 "Memproses Gaji Bulanan": choose a period (steps 1–3), read the draft
 * per mentor (4–7), then "Setujui dan Finalisasi" (8–10). A finalized month is
 * shown read-only from the stored report.
 */
export default function ProsesGajiPage() {
    const [bulan, setBulan] = useState(thisMonth)
    const [confirming, setConfirming] = useState(false)

    const { data, error, isLoading, mutate } = usePeriodeGaji(bulan)
    const isFinal = data?.status === 'final'
    const belumDiabsen = data?.jadwal_belum_diabsen ?? 0

    const finalize = async () => {
        try {
            const response = await api.post('/report/gaji', { bulan, lanjutkan: belumDiabsen > 0 })
            toast.success(response.data?.message ?? 'Gaji berhasil difinalisasi')
            await mutate()
            // The laporan gaji now reads this month from the final report.
            await mutateGlobal((key) => Array.isArray(key) && key[0] === '/report/gaji')
        } catch (err: unknown) {
            const body = (err as { response?: { data?: { message?: string } } }).response?.data
            toast.error(body?.message ?? 'Gagal memfinalisasi gaji')
            throw err
        }
    }

    return (
        <div className="space-y-6">
            <PageHeader
                title="Proses Gaji"
                description="Pilih periode, periksa draf perhitungan gaji, lalu setujui dan finalisasi."
                action={
                    <OutlineButton as="link" href="/aturan-gaji" className="text-xs" icon={<Pencil className="w-4 h-4" />}>
                        Aturan Gaji
                    </OutlineButton>
                }
            />

            <Card className="flex flex-wrap items-end justify-between gap-4">
                <div>
                    <label htmlFor="bulan" className="block text-xs font-medium text-neutral-500">Periode</label>
                    <input
                        id="bulan"
                        type="month"
                        value={bulan}
                        max={thisMonth()}
                        onChange={(e) => e.target.value && setBulan(e.target.value)}
                        className="mt-1 rounded-xl border border-neutral-200 p-2 text-sm focus:border-neutral-400 focus:outline-none"
                    />
                </div>

                <div className="flex flex-wrap items-center gap-3">
                    {data && (
                        <span className={cn('rounded-full border px-3 py-1 text-xs font-semibold', isFinal ? toneClasses.success : toneClasses.warning)}>
                            {isFinal ? 'Final' : 'Draf'}
                        </span>
                    )}
                    {!isFinal && (
                        <PrimaryButton
                            type="button"
                            onClick={() => setConfirming(true)}
                            disabled={!data || isLoading || data.mentor.length === 0}
                            className="text-sm"
                            icon={<Check className="w-4 h-4" strokeWidth={2} />}
                        >
                            Setujui dan Finalisasi
                        </PrimaryButton>
                    )}
                </div>
            </Card>

            {isFinal && data && (
                <div role="status" className="rounded-xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm text-emerald-700">
                    Gaji periode {data.label} sudah difinalisasi
                    {data.finalized_at && <> pada {moment(data.finalized_at).format('D MMMM YYYY HH:mm')}</>}
                    {data.finalized_by && <> oleh {data.finalized_by}</>}. Data periode ini terkunci dan tidak dapat diubah.
                </div>
            )}

            {!isFinal && belumDiabsen > 0 && (
                <div role="alert" className="rounded-xl border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-700">
                    Peringatan: terdapat {belumDiabsen} sesi absensi yang belum terisi pada periode ini. Gaji untuk sesi tersebut belum terhitung.
                </div>
            )}

            {error && (
                <div className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-600">Gagal memuat data proses gaji.</div>
            )}

            <div className="overflow-x-auto rounded-xl border border-neutral-200 bg-white">
                <table className="min-w-full divide-y divide-neutral-200 text-xs">
                    <thead className="bg-neutral-50 text-left uppercase text-neutral-500">
                        <tr>
                            <th className="px-6 py-3 font-medium">Guru/Mentor</th>
                            <th className="px-6 py-3 font-medium text-right">Kehadiran</th>
                            <th className="px-6 py-3 font-medium text-right">Gaji Pokok</th>
                            <th className="px-6 py-3 font-medium text-right">Bonus</th>
                            <th className="px-6 py-3 font-medium text-right">Potongan</th>
                            <th className="px-6 py-3 font-medium text-right">Total</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-neutral-200 text-neutral-600">
                        {isLoading && (
                            <tr><td colSpan={6} className="px-6 py-6 text-center text-neutral-500">Memuat draf gaji…</td></tr>
                        )}
                        {!isLoading && data?.mentor.length === 0 && (
                            <tr><td colSpan={6} className="px-6 py-6 text-center text-neutral-500">Tidak ada kehadiran atau penyesuaian pada periode {data.label}.</td></tr>
                        )}
                        {data?.mentor.map((row) => (
                            <Fragment key={`${row.mentor_id}-${row.mentor}`}>
                                <tr>
                                    <td className="px-6 py-3 font-medium text-neutral-900">{row.mentor}</td>
                                    <td className="px-6 py-3 text-right">{formatNumber(row.total_kehadiran)}</td>
                                    <td className="px-6 py-3 text-right">{formatCurrency(row.gaji_pokok)}</td>
                                    <td className="px-6 py-3 text-right text-emerald-600">{formatCurrency(row.bonus)}</td>
                                    <td className="px-6 py-3 text-right text-red-600">{formatCurrency(row.potongan)}</td>
                                    <td className="px-6 py-3 text-right font-semibold text-neutral-900">{formatCurrency(row.total)}</td>
                                </tr>
                                {(row.rincian.length > 0 || row.penyesuaian.length > 0) && (
                                    <tr className="bg-neutral-50/60">
                                        <td colSpan={6} className="px-6 pb-3 pt-1">
                                            <ul className="space-y-0.5 text-[11px] text-neutral-500">
                                                {row.rincian.map((kelas) => (
                                                    <li key={kelas.kelas_id}>
                                                        {kelas.kelas}: {formatNumber(kelas.jumlah_kehadiran)} kehadiran × {formatCurrency(kelas.tarif)} = {formatCurrency(kelas.nominal)}
                                                    </li>
                                                ))}
                                                {row.penyesuaian.map((p) => (
                                                    <li key={p.id}>
                                                        {p.jenis === 'bonus' ? 'Bonus' : 'Potongan'}{p.keterangan ? ` (${p.keterangan})` : ''}: {p.jenis === 'bonus' ? '+' : '−'}{formatCurrency(p.nominal)}
                                                    </li>
                                                ))}
                                            </ul>
                                        </td>
                                    </tr>
                                )}
                            </Fragment>
                        ))}
                    </tbody>
                    {data && data.mentor.length > 0 && (
                        <tfoot className="bg-neutral-50 font-semibold text-neutral-900">
                            <tr>
                                <td className="px-6 py-3">Total ({data.total.jumlah_mentor} mentor)</td>
                                <td className="px-6 py-3 text-right">{formatNumber(data.total.total_kehadiran)}</td>
                                <td className="px-6 py-3 text-right">{formatCurrency(data.total.gaji_pokok)}</td>
                                <td className="px-6 py-3 text-right">{formatCurrency(data.total.bonus)}</td>
                                <td className="px-6 py-3 text-right">{formatCurrency(data.total.potongan)}</td>
                                <td className="px-6 py-3 text-right">{formatCurrency(data.total.total)}</td>
                            </tr>
                        </tfoot>
                    )}
                </table>
            </div>

            <ConfirmDialog
                isOpen={confirming}
                onClose={() => setConfirming(false)}
                onConfirm={finalize}
                tone="default"
                title="Setujui dan Finalisasi"
                confirmLabel={belumDiabsen > 0 ? 'Lanjutkan' : 'Finalisasi'}
                message={
                    <div className="space-y-2">
                        {belumDiabsen > 0 && (
                            <p className="rounded-lg bg-amber-50 px-3 py-2 text-amber-700">
                                Peringatan: Terdapat {belumDiabsen} sesi absensi yang belum terisi. Apakah Anda yakin ingin melanjutkan?
                            </p>
                        )}
                        <p>
                            Gaji periode <span className="font-semibold">{data?.label}</span> sebesar{' '}
                            <span className="font-semibold">{formatCurrency(data?.total.total ?? 0)}</span> untuk {data?.total.jumlah_mentor ?? 0} mentor akan disimpan sebagai data final.
                        </p>
                        <p>Setelah difinalisasi, absensi, jadwal, tarif yang dipakai, dan penyesuaian periode ini tidak dapat diubah.</p>
                    </div>
                }
            />
        </div>
    )
}
