'use client'

import PageHeader from "@/components/ui/page-header"
import OutlineButton from "@/components/buttons/outline"
import Pagination from "@/components/pagination"
import { InfoCircle } from "@/components/icons/outline"

import DataTable, { type Column } from "@/components/data/data-table"
import SearchInput from "@/components/data/search-input"
import FilterModal, { type SelectOption } from "@/components/data/filter-modal"
import { useListParams } from "@/components/data/use-list-params"

import { useReportAbsensi } from "@/hooks/repositories/use-report"
import { useKelas } from "@/hooks/repositories/use-kelas"
import { monthLabel } from "@/lib/format"
import type { ReportAbsensiRow, Kelas } from "@/lib/types"

const FILTER_KEYS = ['kelas_id', 'from', 'to']

export default function ReportAbsensiPage() {
    const {
        page, search, orderBy, direction,
        searchTemp, setSearchTemp,
        toggleSort, updateFilter, removeFilter, activeFilters,
    } = useListParams(FILTER_KEYS)

    // Previously this page called useKelas() — the source even noted
    // "use nya belom diubah" — so the headers and the body described
    // different things entirely.
    const { data, error, isLoading } = useReportAbsensi({
        page,
        search,
        ...activeFilters,
        order_by: orderBy,
        direction,
    })

    const { data: kelasOptions, isLoading: isLoadingKelas } = useKelas({ paginate: false })

    const kelasSelectOptions: SelectOption[] = ((kelasOptions as unknown as Kelas[]) ?? []).map((kelas) => ({
        value: kelas.id,
        label: kelas.nama,
        description: kelas.tingkat,
    }))

    const columns: Column<ReportAbsensiRow>[] = [
        { key: 'kelas', header: 'Kelas', sortKey: 'kelas', cellClassName: 'font-medium text-neutral-900', render: (row) => row.kelas },
        { key: 'mentor', header: 'Mentor', render: (row) => row.mentor ?? '-' },
        { key: 'bulan', header: 'Bulan', sortKey: 'bulan', render: (row) => monthLabel(row.bulan, row.tahun) },
        { key: 'hadir', header: 'Hadir', sortKey: 'hadir', cellClassName: 'text-sky-600 font-medium', render: (row) => row.hadir },
        { key: 'sakit', header: 'Sakit', sortKey: 'sakit', cellClassName: 'text-amber-600 font-medium', render: (row) => row.sakit },
        { key: 'izin', header: 'Izin', sortKey: 'izin', cellClassName: 'text-neutral-600 font-medium', render: (row) => row.izin },
        { key: 'alpa', header: 'Alpa', sortKey: 'alpa', cellClassName: 'text-red-600 font-medium', render: (row) => row.alpa },
        {
            key: 'actions',
            header: <span className="sr-only">Aksi</span>,
            headerClassName: 'relative',
            cellClassName: 'text-right',
            render: (row) => (
                // Was hardcoded to /report/absensi/1 for every row.
                <OutlineButton
                    as="link"
                    href={`/report/absensi/${row.kelas_id}`}
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
                title="Rekap Absensi Kelas"
                description="Ringkasan kehadiran siswa per kelas per bulan."
            />

            <div className="space-y-6">
                <div className="flex flex-wrap items-center gap-2">
                    <SearchInput value={searchTemp} onChange={setSearchTemp} placeholder="Cari kelas atau mentor" />
                    <FilterModal
                        value={activeFilters}
                        onSubmit={updateFilter}
                        onRemove={removeFilter}
                        fields={[
                            {
                                type: 'select',
                                name: 'kelas_id',
                                label: 'Kelas',
                                placeholder: 'Semua kelas',
                                options: kelasSelectOptions,
                                isLoading: isLoadingKelas,
                            },
                            { type: 'date', name: 'from', label: 'Dari Tanggal' },
                            { type: 'date', name: 'to', label: 'Sampai Tanggal' },
                        ]}
                    />
                </div>

                <DataTable
                    columns={columns}
                    rows={data?.data}
                    rowKey={(row) => `${row.kelas_id}-${row.tahun}-${row.bulan}`}
                    isLoading={isLoading}
                    error={error}
                    isFiltered={!!search || Object.keys(activeFilters).length > 0}
                    orderBy={orderBy}
                    direction={direction}
                    onSort={toggleSort}
                    emptyMessage="Belum ada data absensi"
                />
            </div>

            <Pagination links={data?.links} from={data?.from} to={data?.to} total={data?.total} />
        </div>
    )
}
