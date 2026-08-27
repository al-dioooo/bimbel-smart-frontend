'use client'

import PageHeader from "@/components/ui/page-header"
import OutlineButton from "@/components/buttons/outline"
import MenuAction from "@/components/menu-action"
import Pagination from "@/components/pagination"
import { CircleDashedPlus } from "@/components/icons/outline"

import DataTable, { type Column } from "@/components/data/data-table"
import SearchInput from "@/components/data/search-input"
import FilterModal, { type SelectOption } from "@/components/data/filter-modal"
import ConfirmDialog from "@/components/data/confirm-dialog"
import { useListParams } from "@/components/data/use-list-params"
import { useDeleteResource } from "@/components/data/use-delete-resource"

import { useJadwal } from "@/hooks/repositories/use-jadwal"
import { useKelas } from "@/hooks/repositories/use-kelas"
import { formatDate, formatTimeRange } from "@/lib/format"
import type { Jadwal, Kelas } from "@/lib/types"

const FILTER_KEYS = ['kelas_id', 'from', 'to']

export default function ListJadwalPage() {
    const {
        page, search, orderBy, direction,
        searchTemp, setSearchTemp,
        toggleSort, updateFilter, removeFilter, activeFilters,
    } = useListParams(FILTER_KEYS)

    const { data, mutate, error, isLoading } = useJadwal({
        page,
        search,
        ...activeFilters,
        order_by: orderBy,
        direction,
    })

    const { data: kelasOptions, isLoading: isLoadingKelas } = useKelas({ paginate: false })

    // The list endpoint returns a flat array when paginate=false.
    const kelasSelectOptions: SelectOption[] = ((kelasOptions as unknown as Kelas[]) ?? []).map((kelas) => ({
        value: kelas.id,
        label: kelas.nama,
        description: kelas.tingkat,
    }))

    const remove = useDeleteResource<Jadwal>({
        endpoint: '/jadwal',
        onDeleted: () => mutate(),
        successMessage: 'Jadwal berhasil dihapus',
    })

    // Every header here used to sort by an unrelated column: "Kelas" sorted by
    // `nama`, "Mentor" by `tingkat`, "Tanggal" by `created_at`, "Jam" by
    // `updated_at`. Kelas and mentor live on related tables, so they are not
    // sortable through the current endpoint and are rendered as plain headers.
    const columns: Column<Jadwal>[] = [
        { key: 'kelas', header: 'Kelas', cellClassName: 'font-medium text-neutral-900', render: (row) => row.kelas?.nama ?? '-' },
        { key: 'mentor', header: 'Mentor', render: (row) => row.kelas?.mentor?.user?.name ?? '-' },
        { key: 'tanggal', header: 'Tanggal', sortKey: 'tanggal', render: (row) => formatDate(row.tanggal as unknown as string) },
        { key: 'jam', header: 'Jam', sortKey: 'waktu_mulai', render: (row) => formatTimeRange(row.waktu_mulai, row.waktu_selesai) },
        { key: 'materi', header: 'Materi', render: (row) => row.materi || '-' },
        {
            key: 'actions',
            header: <span className="sr-only">Aksi</span>,
            headerClassName: 'relative',
            cellClassName: 'text-right',
            render: (row) => (
                <MenuAction
                    showDetail={false}
                    editLink={`/jadwal/${row.id}/edit`}
                    onDelete={() => remove.request(row)}
                />
            ),
        },
    ]

    return (
        <div className="space-y-6">
            <PageHeader title="List Jadwal" />

            <div className="space-y-6">
                <div className="flex flex-wrap items-center justify-between gap-2">
                    <div className="flex flex-wrap items-center gap-2">
                        <SearchInput value={searchTemp} onChange={setSearchTemp} placeholder="Cari kelas" />
                        <FilterModal
                            value={activeFilters}
                            onSubmit={updateFilter}
                            onRemove={removeFilter}
                            fields={[
                                {
                                    type: 'select',
                                    name: 'kelas_id',
                                    label: 'Kelas',
                                    placeholder: 'Pilih kelas',
                                    options: kelasSelectOptions,
                                    isLoading: isLoadingKelas,
                                },
                                { type: 'date', name: 'from', label: 'Dari Tanggal' },
                                { type: 'date', name: 'to', label: 'Sampai Tanggal' },
                            ]}
                        />
                    </div>
                    <OutlineButton as="link" href="/jadwal/create" className="text-xs" icon={<CircleDashedPlus className="w-5 h-5" />}>
                        Tambah Jadwal
                    </OutlineButton>
                </div>

                <DataTable
                    columns={columns}
                    rows={data?.data}
                    rowKey={(row) => row.id}
                    isLoading={isLoading}
                    error={error}
                    isFiltered={!!search || Object.keys(activeFilters).length > 0}
                    orderBy={orderBy}
                    direction={direction}
                    onSort={toggleSort}
                    emptyMessage="Belum ada jadwal"
                />
            </div>

            <Pagination links={data?.links} from={data?.from} to={data?.to} total={data?.total} />

            <ConfirmDialog
                isOpen={remove.isOpen}
                onClose={remove.cancel}
                onConfirm={remove.confirm}
                title="Hapus Jadwal"
                message={<>Hapus jadwal <span className="font-semibold">{remove.target?.kelas?.nama}</span> pada {formatDate(remove.target?.tanggal as unknown as string)}?</>}
            />
        </div>
    )
}
