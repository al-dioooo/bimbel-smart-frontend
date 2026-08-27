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

import { useMentor } from "@/hooks/repositories/use-mentor"
import { formatDate } from "@/lib/format"
import type { Mentor } from "@/lib/types"

const FILTER_KEYS = ['nama', 'kontak', 'from', 'to']

export default function ListMentorPage() {
    const {
        page, search, orderBy, direction,
        searchTemp, setSearchTemp,
        toggleSort, updateFilter, removeFilter, activeFilters,
    } = useListParams(FILTER_KEYS)

    const { data, mutate, error, isLoading } = useMentor({
        page,
        search,
        ...activeFilters,
        order_by: orderBy,
        direction,
    })

    const remove = useDeleteResource<Mentor>({
        endpoint: '/mentor',
        onDeleted: () => mutate(),
        successMessage: 'Mentor berhasil dihapus',
    })

    const columns: Column<Mentor>[] = [
        // MentorController joins users and aliases users.name as user_name,
        // so that alias is what the API can sort on.
        { key: 'nama', header: 'Nama', sortKey: 'user_name', cellClassName: 'font-medium text-neutral-900', render: (row) => row.user?.name ?? '-' },
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
                    editLink={`/data/mentor/${row.id}/edit`}
                    onDelete={() => remove.request(row)}
                />
            ),
        },
    ]

    return (
        <div className="space-y-6">
            <PageHeader title="List Mentor" />

            <div className="space-y-6">
                <div className="flex flex-wrap items-center justify-between gap-2">
                    <div className="flex flex-wrap items-center gap-2">
                        <SearchInput value={searchTemp} onChange={setSearchTemp} placeholder="Cari mentor" />
                        <FilterModal
                            value={activeFilters}
                            onSubmit={updateFilter}
                            onRemove={removeFilter}
                            fields={[
                                { type: 'text', name: 'nama', label: 'Nama', placeholder: 'Nama mentor' },
                                { type: 'text', name: 'kontak', label: 'Kontak', placeholder: 'Nomor kontak' },
                                { type: 'date', name: 'from', label: 'Dari Tanggal' },
                                { type: 'date', name: 'to', label: 'Sampai Tanggal' },
                            ]}
                        />
                    </div>
                    <OutlineButton as="link" href="/data/mentor/create" className="text-xs" icon={<CircleDashedPlus className="w-5 h-5" />}>
                        Tambah Mentor
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
                    emptyMessage="Belum ada mentor"
                />
            </div>

            <Pagination links={data?.links} from={data?.from} to={data?.to} total={data?.total} />

            <ConfirmDialog
                isOpen={remove.isOpen}
                onClose={remove.cancel}
                onConfirm={remove.confirm}
                title="Hapus Mentor"
                message={<>Hapus mentor <span className="font-semibold">{remove.target?.user?.name}</span>? Tindakan ini tidak dapat dibatalkan.</>}
            />
        </div>
    )
}
