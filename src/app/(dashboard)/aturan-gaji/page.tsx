'use client'

import PageHeader from "@/components/ui/page-header"
import OutlineButton from "@/components/buttons/outline"
import MenuAction from "@/components/menu-action"
import Pagination from "@/components/pagination"
import { ArrowNarrowLeft } from "@/components/icons/outline"

import DataTable, { type Column } from "@/components/data/data-table"
import SearchInput from "@/components/data/search-input"
import ConfirmDialog from "@/components/data/confirm-dialog"
import { useListParams } from "@/components/data/use-list-params"
import { useDeleteResource } from "@/components/data/use-delete-resource"

import { useAturanGaji } from "@/hooks/repositories/use-aturan-gaji"
import { formatCurrency } from "@/lib/format"
import type { AturanGaji } from "@/lib/types"

export default function ListAturanGajiPage() {
    const {
        page, search, orderBy, direction,
        searchTemp, setSearchTemp,
        toggleSort,
    } = useListParams()

    const { data, mutate, error, isLoading } = useAturanGaji({
        page,
        search,
        order_by: orderBy,
        direction,
    })

    const remove = useDeleteResource<AturanGaji>({
        endpoint: '/aturan-gaji',
        onDeleted: () => mutate(),
        successMessage: 'Aturan gaji berhasil dihapus',
    })

    const columns: Column<AturanGaji>[] = [
        {
            key: 'kelas',
            header: 'Kelas',
            // The controller aliases kelas.nama, which is what it can sort on.
            sortKey: 'kelas_nama',
            cellClassName: 'font-medium text-neutral-900',
            render: (row) => row.kelas?.nama ?? '-',
        },
        { key: 'tingkat', header: 'Tingkat', render: (row) => row.kelas?.tingkat ?? '-' },
        {
            key: 'tarif',
            header: 'Tarif per Kehadiran',
            sortKey: 'tarif',
            cellClassName: 'font-medium text-emerald-600',
            render: (row) => formatCurrency(row.tarif),
        },
        {
            key: 'actions',
            header: <span className="sr-only">Aksi</span>,
            headerClassName: 'relative',
            cellClassName: 'text-right',
            render: (row) => (
                <MenuAction
                    showDetail={false}
                    // This used to point at /data/siswa/{id}/edit — a different entity entirely.
                    editLink={`/aturan-gaji/${row.id}/edit`}
                    onDelete={() => remove.request(row)}
                />
            ),
        },
    ]

    return (
        <div className="space-y-6">
            <PageHeader
                title="Aturan Gaji"
                description="Tarif yang dibayarkan ke mentor untuk setiap kehadiran siswa."
            />

            <div className="space-y-6">
                {/* The toolbar state existed in code but was never rendered, so the
                    debounce wrote ?search= for an input that did not exist. */}
                <div className="flex flex-wrap items-center justify-between gap-2">
                    <SearchInput value={searchTemp} onChange={setSearchTemp} placeholder="Cari kelas" />
                    <OutlineButton
                        as="link"
                        href="/report/gaji"
                        buttonType="secondary"
                        className="text-xs"
                        icon={<ArrowNarrowLeft className="w-5 h-5" />}
                    >
                        Kembali ke Report Gaji
                    </OutlineButton>
                </div>

                <DataTable
                    columns={columns}
                    rows={data?.data}
                    rowKey={(row) => row.id}
                    isLoading={isLoading}
                    error={error}
                    isFiltered={!!search}
                    orderBy={orderBy}
                    direction={direction}
                    onSort={toggleSort}
                    emptyMessage="Belum ada aturan gaji"
                />
            </div>

            <Pagination links={data?.links} from={data?.from} to={data?.to} total={data?.total} />

            <ConfirmDialog
                isOpen={remove.isOpen}
                onClose={remove.cancel}
                onConfirm={remove.confirm}
                title="Hapus Aturan Gaji"
                message={<>Hapus aturan gaji untuk <span className="font-semibold">{remove.target?.kelas?.nama}</span>?</>}
            />
        </div>
    )
}
