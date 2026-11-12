'use client'

import { use, useState } from "react"
import moment from "moment"
import { useRouter, useSearchParams } from "next/navigation"
import { toast } from "sonner"

import PageHeader from "@/components/ui/page-header"
import OutlineButton from "@/components/buttons/outline"
import PrimaryButton from "@/components/buttons/primary"
import Pagination from "@/components/pagination"
import { Card } from "@/components/ui/card"
import { ArrowNarrowLeft } from "@/components/icons/outline"

import DataTable, { type Column } from "@/components/data/data-table"
import { useListParams } from "@/components/data/use-list-params"

import { useReportGajiByMentor } from "@/hooks/repositories/use-report"
import { useAccess } from "@/hooks/use-user"
import { downloadErrorMessage, downloadFile } from "@/lib/download"
import { formatCurrency, formatNumber, monthLabel } from "@/lib/format"
import { toneClasses } from "@/lib/status"
import { cn } from "@/lib/utils"
import type { ReportGajiDetailRow } from "@/lib/types"

/**
 * Rincian / slip gaji of one mentor (REQ-059, REQ-060): per kelas, the
 * month's bonus and potongan, and the total. "Unduh Slip (PDF)" is REQ-061.
 * Admins open any mentor; a mentor only their own ("Gaji Saya").
 */
export default function ReportGajiDetailPage({ params }: { params: Promise<{ id: string }> }) {
    const { id } = use(params)
    const router = useRouter()
    const searchParams = useSearchParams()

    const { page, orderBy, direction, toggleSort } = useListParams()
    const { isAdmin } = useAccess()

    // The month on screen; empty means every month. Defaults to this month.
    const bulan = searchParams.get('bulan') ?? moment().format('YYYY-MM')
    const setBulan = (value: string) => {
        const next = new URLSearchParams(searchParams.toString())
        next.set('bulan', value)
        next.delete('page')
        router.replace(`?${next.toString()}`)
    }

    const { data, error, isLoading } = useReportGajiByMentor(Number(id), {
        page,
        order_by: orderBy,
        direction,
        ...(bulan ? { bulan } : {}),
    })

    const rows = data?.rows?.data ?? []
    const penyesuaian = data?.penyesuaian ?? []
    const mentorName = rows[0]?.mentor
    const pokok = rows.reduce((sum, row) => sum + Number(row.nominal ?? 0), 0)
    const bonus = penyesuaian.filter((p) => p.jenis === 'bonus').reduce((sum, p) => sum + Number(p.nominal), 0)
    const potongan = penyesuaian.filter((p) => p.jenis === 'potongan').reduce((sum, p) => sum + Number(p.nominal), 0)
    const isFinal = rows.length > 0 && rows.every((row) => row.status === 'final')

    const [isDownloading, setIsDownloading] = useState(false)
    const downloadSlip = async () => {
        setIsDownloading(true)
        try {
            await downloadFile(`/report/gaji/${id}`, { format: 'pdf', bulan }, `slip-gaji-${bulan}.pdf`)
        } catch (err) {
            toast.error(await downloadErrorMessage(err, 'Gagal mengunduh slip gaji'))
        } finally {
            setIsDownloading(false)
        }
    }

    const columns: Column<ReportGajiDetailRow>[] = [
        { key: 'kelas', header: 'Kelas', cellClassName: 'font-medium text-neutral-900', render: (row) => row.kelas },
        { key: 'bulan', header: 'Bulan', sortKey: 'bulan', render: (row) => monthLabel(row.bulan, row.tahun) },
        { key: 'tarif', header: 'Tarif', render: (row) => formatCurrency(row.tarif) },
        { key: 'kehadiran', header: 'Jumlah Kehadiran', render: (row) => formatNumber(row.jumlah_kehadiran) },
        {
            key: 'nominal',
            header: 'Subtotal',
            cellClassName: 'font-medium text-emerald-600',
            render: (row) => formatCurrency(row.nominal),
        },
        {
            key: 'status',
            header: 'Status',
            render: (row) => (
                <span className={cn('rounded-full border px-2 py-0.5 font-semibold', row.status === 'final' ? toneClasses.success : toneClasses.warning)}>
                    {row.status === 'final' ? 'Final' : 'Draf'}
                </span>
            ),
        },
    ]

    return (
        <div className="space-y-6">
            <PageHeader
                title={mentorName ? `Gaji ${mentorName}` : 'Detail Gaji Mentor'}
                description="Rincian per kelas, bonus, dan potongan yang membentuk gaji."
                action={isAdmin && (
                    <OutlineButton
                        as="link"
                        href="/report/gaji"
                        buttonType="secondary"
                        className="text-xs"
                        icon={<ArrowNarrowLeft className="w-4 h-4" />}
                    >
                        Kembali
                    </OutlineButton>
                )}
            />

            <Card className="flex flex-wrap items-end justify-between gap-4">
                <div className="flex flex-wrap items-end gap-2">
                    <div>
                        <label htmlFor="bulan" className="block text-xs font-medium text-neutral-500">Bulan</label>
                        <input
                            id="bulan"
                            type="month"
                            value={bulan}
                            onChange={(e) => setBulan(e.target.value)}
                            className="mt-1 rounded-xl border border-neutral-200 p-2 text-sm focus:border-neutral-400 focus:outline-none"
                        />
                    </div>
                    {bulan && (
                        <OutlineButton type="button" buttonType="secondary" className="text-xs" onClick={() => setBulan('')}>
                            Semua bulan
                        </OutlineButton>
                    )}
                </div>
                <PrimaryButton
                    type="button"
                    onClick={downloadSlip}
                    isLoading={isDownloading}
                    disabled={!bulan || isDownloading}
                    title={bulan ? undefined : 'Pilih bulan untuk mengunduh slip'}
                    className="text-sm"
                >
                    Unduh Slip (PDF)
                </PrimaryButton>
            </Card>

            <Card>
                <div className="flex flex-wrap items-start justify-between gap-4">
                    <div>
                        <p className="text-xs font-medium text-neutral-500">{bulan ? `Total Gaji ${moment(bulan).format('MMMM YYYY')}` : 'Total Gaji (semua bulan)'}</p>
                        <p className="mt-1 text-3xl font-bold text-emerald-600">
                            {isLoading ? '—' : formatCurrency(pokok + bonus - potongan)}
                        </p>
                    </div>
                    {bulan && rows.length > 0 && (
                        <span className={cn('rounded-full border px-3 py-1 text-xs font-semibold', isFinal ? toneClasses.success : toneClasses.warning)}>
                            {isFinal ? 'Final' : 'Draf'}
                        </span>
                    )}
                </div>
                <dl className="mt-3 grid gap-2 text-xs text-neutral-600 sm:grid-cols-3">
                    <div><dt>Gaji pokok</dt><dd className="font-semibold text-neutral-900">{formatCurrency(pokok)}</dd></div>
                    <div><dt>Bonus</dt><dd className="font-semibold text-emerald-600">{formatCurrency(bonus)}</dd></div>
                    <div><dt>Potongan</dt><dd className="font-semibold text-red-600">{formatCurrency(potongan)}</dd></div>
                </dl>
                {penyesuaian.length > 0 && (
                    <ul className="mt-3 space-y-0.5 border-t border-neutral-100 pt-3 text-xs text-neutral-500">
                        {penyesuaian.map((p) => (
                            <li key={p.id}>
                                {p.jenis === 'bonus' ? 'Bonus' : 'Potongan'} {moment(p.periode).format('MMMM YYYY')}
                                {p.keterangan ? ` (${p.keterangan})` : ''}: {p.jenis === 'bonus' ? '+' : '−'}{formatCurrency(p.nominal)}
                            </li>
                        ))}
                    </ul>
                )}
            </Card>

            <DataTable
                columns={columns}
                rows={data?.rows?.data}
                rowKey={(row) => `${row.kelas_id}-${row.tahun}-${row.bulan}`}
                isLoading={isLoading}
                error={error}
                orderBy={orderBy}
                direction={direction}
                onSort={toggleSort}
                emptyMessage={bulan ? 'Belum ada kehadiran tercatat pada bulan ini' : 'Belum ada kehadiran tercatat untuk mentor ini'}
            />

            <Pagination links={data?.rows?.links} from={data?.rows?.from} to={data?.rows?.to} total={data?.rows?.total} />
        </div>
    )
}
