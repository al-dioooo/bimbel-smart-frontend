'use client'

import PageHeader from "@/components/ui/page-header"
import OutlineButton from "@/components/buttons/outline"
import MenuAction from "@/components/menu-action"
import Pagination from "@/components/pagination"
import { CircleDashedPlus } from "@/components/icons/outline"

import DataTable, { type Column } from "@/components/data/data-table"
import SearchInput from "@/components/data/search-input"
import FilterModal from "@/components/data/filter-modal"
import ConfirmDialog from "@/components/data/confirm-dialog"
import { useListParams } from "@/components/data/use-list-params"
import { useDeleteResource } from "@/components/data/use-delete-resource"

import { useKelas } from "@/hooks/repositories/use-kelas"
import { formatDate } from "@/lib/format"
import type { Kelas } from "@/lib/types"

const FILTER_KEYS = ['nama', 'tingkat', 'from', 'to']

export default function ListKelasPage() {
    const {
        page, search, orderBy, direction,
        searchTemp, setSearchTemp,
        toggleSort, updateFilter, removeFilter, activeFilters,
    } = useListParams(FILTER_KEYS)

    const { data, mutate, error, isLoading } = useKelas({
        page,
        search,
        ...activeFilters,
        order_by: orderBy,
        direction,
    })

    const remove = useDeleteResource<Kelas>({
        endpoint: '/kelas',
        onDeleted: () => mutate(),
        successMessage: 'Kelas berhasil dihapus',
    })

    const columns: Column<Kelas>[] = [
        {
            key: 'nama',
            header: 'Nama',
            sortKey: 'nama',
            cellClassName: 'font-medium text-neutral-900',
            render: (row) => row.nama,
        },
        { key: 'tingkat', header: 'Tingkat', sortKey: 'tingkat', render: (row) => row.tingkat },
        { key: 'mentor', header: 'Mentor', render: (row) => row.mentor?.user?.name ?? '-' },
        { key: 'created_at', header: 'Dibuat Pada', sortKey: 'created_at', render: (row) => formatDate(row.created_at) },
        { key: 'updated_at', header: 'Diubah Pada', sortKey: 'updated_at', render: (row) => formatDate(row.updated_at) },
        {
            key: 'actions',
            header: <span className="sr-only">Aksi</span>,
            headerClassName: 'relative',
            cellClassName: 'text-right',
            render: (row) => (
                <MenuAction
                    detailLink={`/data/kelas/${row.id}`}
                    editLink={`/data/kelas/${row.id}/edit`}
                    onDelete={() => remove.request(row)}
                />
            ),
        },
    ]

    return (
        <div className="space-y-6">
            <PageHeader title="List Kelas" />

            <div className="space-y-6">
                <div className="flex flex-wrap items-center justify-between gap-2">
                    <div className="flex flex-wrap items-center gap-2">
                        <SearchInput value={searchTemp} onChange={setSearchTemp} placeholder="Cari kelas" />
                        <FilterModal
                            value={activeFilters}
                            onSubmit={updateFilter}
                            onRemove={removeFilter}
                            fields={[
                                { type: 'text', name: 'nama', label: 'Nama', placeholder: 'Nama kelas' },
                                { type: 'text', name: 'tingkat', label: 'Tingkat', placeholder: 'Tingkat kelas' },
                                { type: 'date', name: 'from', label: 'Dari Tanggal' },
                                { type: 'date', name: 'to', label: 'Sampai Tanggal' },
                            ]}
                        />
                    </div>
                    <OutlineButton as="link" href="/data/kelas/create" className="text-xs" icon={<CircleDashedPlus className="w-5 h-5" />}>
                        Tambah Kelas
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
                    emptyMessage="Belum ada kelas"
                />
            </div>

            <Pagination links={data?.links} from={data?.from} to={data?.to} total={data?.total} />

            <ConfirmDialog
                isOpen={remove.isOpen}
                onClose={remove.cancel}
                onConfirm={remove.confirm}
                title="Hapus Kelas"
                message={<>Hapus kelas <span className="font-semibold">{remove.target?.nama}</span>? Tindakan ini tidak dapat dibatalkan.</>}
            />
        </div>
    )
}
