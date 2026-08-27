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

import { useSiswa } from "@/hooks/repositories/use-siswa"
import { useKelas } from "@/hooks/repositories/use-kelas"
import { formatDate } from "@/lib/format"
import type { Siswa, Kelas } from "@/lib/types"

const FILTER_KEYS = ['nama', 'kelas_id', 'from', 'to']

export default function ListSiswaPage() {
    const {
        page, search, orderBy, direction,
        searchTemp, setSearchTemp,
        toggleSort, updateFilter, removeFilter, activeFilters,
    } = useListParams(FILTER_KEYS)

    const { data, mutate, error, isLoading } = useSiswa({
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

    const remove = useDeleteResource<Siswa>({
        endpoint: '/siswa',
        onDeleted: () => mutate(),
        successMessage: 'Siswa berhasil dihapus',
    })

    const columns: Column<Siswa>[] = [
        { key: 'nama', header: 'Nama', sortKey: 'nama', cellClassName: 'font-medium text-neutral-900', render: (row) => row.nama },
        { key: 'kelas', header: 'Kelas', render: (row) => row.kelas?.nama ?? '-' },
        { key: 'kontak', header: 'Kontak', sortKey: 'kontak', render: (row) => row.kontak ?? '-' },
        { key: 'created_at', header: 'Dibuat Pada', sortKey: 'created_at', render: (row) => formatDate(row.created_at) },
        { key: 'updated_at', header: 'Diubah Pada', sortKey: 'updated_at', render: (row) => formatDate(row.updated_at) },
        {
            key: 'actions',
            header: <span className="sr-only">Aksi</span>,
            headerClassName: 'relative',
            cellClassName: 'text-right',
            render: (row) => (
                <MenuAction
                    showDetail={false}
                    editLink={`/data/siswa/${row.id}/edit`}
                    onDelete={() => remove.request(row)}
                />
            ),
        },
    ]

    return (
        <div className="space-y-6">
            <PageHeader title="List Siswa" />

            <div className="space-y-6">
                <div className="flex flex-wrap items-center justify-between gap-2">
                    <div className="flex flex-wrap items-center gap-2">
                        <SearchInput value={searchTemp} onChange={setSearchTemp} placeholder="Cari siswa" />
                        <FilterModal
                            value={activeFilters}
                            onSubmit={updateFilter}
                            onRemove={removeFilter}
                            fields={[
                                { type: 'text', name: 'nama', label: 'Nama', placeholder: 'Nama siswa' },
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
                    <OutlineButton as="link" href="/data/siswa/create" className="text-xs" icon={<CircleDashedPlus className="w-5 h-5" />}>
                        Tambah Siswa
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
                    emptyMessage="Belum ada siswa"
                />
            </div>

            <Pagination links={data?.links} from={data?.from} to={data?.to} total={data?.total} />

            <ConfirmDialog
                isOpen={remove.isOpen}
                onClose={remove.cancel}
                onConfirm={remove.confirm}
                title="Hapus Siswa"
                message={<>Hapus siswa <span className="font-semibold">{remove.target?.nama}</span>? Tindakan ini tidak dapat dibatalkan.</>}
            />
        </div>
    )
}
