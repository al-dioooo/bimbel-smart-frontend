'use client'

import { use } from "react"

import PageHeader from "@/components/ui/page-header"
import OutlineButton from "@/components/buttons/outline"
import Pagination from "@/components/pagination"
import { Card } from "@/components/ui/card"
import { ArrowNarrowLeft } from "@/components/icons/outline"

import DataTable, { type Column } from "@/components/data/data-table"
import { useListParams } from "@/components/data/use-list-params"

import { useReportGajiByMentor } from "@/hooks/repositories/use-report"
import { formatCurrency, formatNumber, monthLabel } from "@/lib/format"
import type { ReportGajiDetailRow } from "@/lib/types"

export default function ReportGajiDetailPage({ params }: { params: Promise<{ id: string }> }) {
    const { id } = use(params)

    const { page, orderBy, direction, toggleSort } = useListParams()

    const { data, error, isLoading } = useReportGajiByMentor(Number(id), {
        page,
        order_by: orderBy,
        direction,
    })

    const rows = data?.data ?? []
    const mentorName = rows[0]?.mentor
    const total = rows.reduce((sum, row) => sum + Number(row.nominal ?? 0), 0)

    const columns: Column<ReportGajiDetailRow>[] = [
        { key: 'kelas', header: 'Kelas', cellClassName: 'font-medium text-neutral-900', render: (row) => row.kelas },
        { key: 'bulan', header: 'Bulan', sortKey: 'bulan', render: (row) => monthLabel(row.bulan, row.tahun) },
        { key: 'tarif', header: 'Tarif', render: (row) => formatCurrency(row.tarif) },
        { key: 'kehadiran', header: 'Jumlah Kehadiran', render: (row) => formatNumber(row.jumlah_kehadiran) },
        {
            key: 'nominal',
            header: 'Nominal',
            cellClassName: 'font-medium text-emerald-600',
            render: (row) => formatCurrency(row.nominal),
        },
    ]

    return (
        <div className="space-y-6">
            <PageHeader
                title={mentorName ? `Gaji ${mentorName}` : 'Detail Gaji Mentor'}
                description="Rincian per kelas yang membentuk total gaji."
                action={
                    <OutlineButton
                        as="link"
                        href="/report/gaji"
                        buttonType="secondary"
                        className="text-xs"
                        icon={<ArrowNarrowLeft className="w-4 h-4" />}
                    >
                        Kembali
                    </OutlineButton>
                }
            />

            <Card>
                <p className="text-xs font-medium text-neutral-500">Total Gaji</p>
                <p className="mt-1 text-3xl font-bold text-emerald-600">
                    {isLoading ? '—' : formatCurrency(total)}
                </p>
            </Card>

            <DataTable
                columns={columns}
                rows={data?.data}
                rowKey={(row) => `${row.kelas_id}-${row.tahun}-${row.bulan}`}
                isLoading={isLoading}
                error={error}
                orderBy={orderBy}
                direction={direction}
                onSort={toggleSort}
                emptyMessage="Belum ada kehadiran tercatat untuk mentor ini"
            />

            <Pagination links={data?.links} from={data?.from} to={data?.to} total={data?.total} />
        </div>
    )
}
