'use client'

import { use } from "react"

import PageHeader from "@/components/ui/page-header"
import OutlineButton from "@/components/buttons/outline"
import Pagination from "@/components/pagination"
import { Card } from "@/components/ui/card"
import { ArrowNarrowLeft } from "@/components/icons/outline"

import DataTable, { type Column } from "@/components/data/data-table"
import SearchInput from "@/components/data/search-input"
import { useListParams } from "@/components/data/use-list-params"

import { useReportAbsensiByKelas } from "@/hooks/repositories/use-report"
import { attendance } from "@/lib/status"
import type { ReportAbsensiSiswaRow } from "@/lib/types"

/**
 * Per-student attendance breakdown for one class.
 *
 * This route existed as a 0-byte file — it had no default export, which broke
 * `next build` outright, while three buttons on the parent page linked to it.
 */
export default function ReportAbsensiDetailPage({ params }: { params: Promise<{ id: string }> }) {
    const { id } = use(params)

    const {
        page, search, orderBy, direction,
        searchTemp, setSearchTemp,
        toggleSort,
    } = useListParams()

    const { data, error, isLoading } = useReportAbsensiByKelas(Number(id), {
        page,
        search,
        order_by: orderBy,
        direction,
    })

    const kelas = data?.kelas
    const rekap = data?.rekap

    const totals = (rekap?.data ?? []).reduce(
        (acc, row) => ({
            hadir: acc.hadir + row.hadir,
            sakit: acc.sakit + row.sakit,
            izin: acc.izin + row.izin,
            alpa: acc.alpa + row.alpa,
        }),
        { hadir: 0, sakit: 0, izin: 0, alpa: 0 }
    )

    const columns: Column<ReportAbsensiSiswaRow>[] = [
        { key: 'siswa', header: 'Nama Siswa', sortKey: 'siswa', cellClassName: 'font-medium text-neutral-900', render: (row) => row.siswa },
        { key: 'hadir', header: 'Hadir', sortKey: 'hadir', cellClassName: 'text-sky-600 font-medium', render: (row) => row.hadir },
        { key: 'sakit', header: 'Sakit', sortKey: 'sakit', cellClassName: 'text-amber-600 font-medium', render: (row) => row.sakit },
        { key: 'izin', header: 'Izin', sortKey: 'izin', cellClassName: 'text-neutral-600 font-medium', render: (row) => row.izin },
        { key: 'alpa', header: 'Alpa', sortKey: 'alpa', cellClassName: 'text-red-600 font-medium', render: (row) => row.alpa },
        { key: 'total', header: 'Total', sortKey: 'total', cellClassName: 'font-semibold text-neutral-900', render: (row) => row.total },
    ]

    return (
        <div className="space-y-6">
            <PageHeader
                title={kelas?.nama ? `Rekap Absensi ${kelas.nama}` : 'Rekap Absensi Kelas'}
                description={kelas?.mentor ? `Mentor: ${kelas.mentor}` : undefined}
                action={
                    <OutlineButton
                        as="link"
                        href="/report/absensi"
                        buttonType="secondary"
                        className="text-xs"
                        icon={<ArrowNarrowLeft className="w-4 h-4" />}
                    >
                        Kembali
                    </OutlineButton>
                }
            />

            <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
                {(['h', 's', 'i', 'a'] as const).map((code) => {
                    const meta = attendance[code]
                    const value = code === 'h' ? totals.hadir
                        : code === 's' ? totals.sakit
                        : code === 'i' ? totals.izin
                        : totals.alpa
                    return (
                        <Card key={code}>
                            <p className="text-xs font-medium text-neutral-500">{meta.label}</p>
                            <p className="mt-1 text-2xl font-bold text-neutral-900">
                                {isLoading ? '—' : value}
                            </p>
                        </Card>
                    )
                })}
            </div>

            <div className="space-y-6">
                <SearchInput value={searchTemp} onChange={setSearchTemp} placeholder="Cari siswa" />

                <DataTable
                    columns={columns}
                    rows={rekap?.data}
                    rowKey={(row) => row.siswa_id}
                    isLoading={isLoading}
                    error={error}
                    isFiltered={!!search}
                    orderBy={orderBy}
                    direction={direction}
                    onSort={toggleSort}
                    emptyMessage="Belum ada absensi tercatat untuk kelas ini"
                />
            </div>

            <Pagination links={rekap?.links} from={rekap?.from} to={rekap?.to} total={rekap?.total} />
        </div>
    )
}
