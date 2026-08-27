'use client'

import PageHeader from "@/components/ui/page-header"
import OutlineButton from "@/components/buttons/outline"
import Pagination from "@/components/pagination"
import { InfoCircle, Pencil } from "@/components/icons/outline"

import DataTable, { type Column } from "@/components/data/data-table"
import SearchInput from "@/components/data/search-input"
import FilterModal from "@/components/data/filter-modal"
import { useListParams } from "@/components/data/use-list-params"

import { useReportGaji } from "@/hooks/repositories/use-report"
import { formatCurrency, formatNumber, monthLabel } from "@/lib/format"
import type { ReportGajiRow } from "@/lib/types"

const FILTER_KEYS = ['from', 'to']

export default function ReportGajiPage() {
    const {
        page, search, orderBy, direction,
        searchTemp, setSearchTemp,
        toggleSort, updateFilter, removeFilter, activeFilters,
    } = useListParams(FILTER_KEYS)

    // This page used to call useKelas(), throw the result away, and render a
    // hardcoded single-row literal.
    const { data, error, isLoading } = useReportGaji({
        page,
        search,
        ...activeFilters,
        order_by: orderBy,
        direction,
    })

    const columns: Column<ReportGajiRow>[] = [
        { key: 'mentor', header: 'Nama', sortKey: 'mentor', cellClassName: 'font-medium text-neutral-900', render: (row) => row.mentor },
        { key: 'bulan', header: 'Bulan', sortKey: 'bulan', render: (row) => monthLabel(row.bulan, row.tahun) },
        {
            key: 'kehadiran',
            header: 'Total Kehadiran Murid',
            sortKey: 'total_kehadiran_murid',
            render: (row) => formatNumber(row.total_kehadiran_murid),
        },
        {
            key: 'nominal',
            header: 'Nominal',
            sortKey: 'nominal',
            cellClassName: 'font-medium text-emerald-600',
            render: (row) => formatCurrency(row.nominal),
        },
        {
            key: 'actions',
            header: <span className="sr-only">Aksi</span>,
            headerClassName: 'relative',
            cellClassName: 'text-right',
            render: (row) => (
                <OutlineButton
                    as="link"
                    href={`/report/gaji/${row.mentor_id}`}
                    className="text-xs"
                    icon={<InfoCircle className="w-4 h-4" />}
                >
                    Detail
                </OutlineButton>
            ),
        },
    ]

    return (
        <div className="space-y-6">
            <PageHeader
                title="Konversi Gaji Mentor"
                description="Gaji dihitung dari tarif kelas dikali jumlah kehadiran siswa."
            />

            <div className="space-y-6">
                <div className="flex flex-wrap items-center justify-between gap-2">
                    <div className="flex flex-wrap items-center gap-2">
                        <SearchInput value={searchTemp} onChange={setSearchTemp} placeholder="Cari mentor" />
                        <FilterModal
                            value={activeFilters}
                            onSubmit={updateFilter}
                            onRemove={removeFilter}
                            fields={[
                                { type: 'date', name: 'from', label: 'Dari Tanggal' },
                                { type: 'date', name: 'to', label: 'Sampai Tanggal' },
                            ]}
                        />
                    </div>
                    <OutlineButton as="link" href="/aturan-gaji" className="text-xs" icon={<Pencil className="w-4 h-4" />}>
                        Aturan Gaji
                    </OutlineButton>
                </div>

                <DataTable
                    columns={columns}
                    rows={data?.data}
                    rowKey={(row) => `${row.mentor_id}-${row.tahun}-${row.bulan}`}
                    isLoading={isLoading}
                    error={error}
                    isFiltered={!!search || Object.keys(activeFilters).length > 0}
                    orderBy={orderBy}
                    direction={direction}
                    onSort={toggleSort}
                    emptyMessage="Belum ada data gaji"
                />
            </div>

            <Pagination links={data?.links} from={data?.from} to={data?.to} total={data?.total} />
        </div>
    )
}
