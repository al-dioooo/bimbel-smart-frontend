'use client'

import { toast } from "sonner"

import PageHeader from "@/components/ui/page-header"
import Pagination from "@/components/pagination"
import PengajuanAction from "@/components/pengajuan-action"

import DataTable, { type Column } from "@/components/data/data-table"
import SearchInput from "@/components/data/search-input"
import FilterModal, { type SelectOption } from "@/components/data/filter-modal"
import { useListParams } from "@/components/data/use-list-params"

import { usePengajuanJadwal } from "@/hooks/repositories/use-pengajuan-jadwal"
import api from "@/lib/axios"
import { formatDate, formatTimeRange } from "@/lib/format"
import { pengajuanStatus, type PengajuanStatus } from "@/lib/status"
import type { PaginatedResponse, PengajuanJadwal } from "@/lib/types"

const FILTER_KEYS = ['status', 'from', 'to']

const STATUS_OPTIONS: SelectOption[] = (Object.keys(pengajuanStatus) as PengajuanStatus[]).map((value) => ({
    value,
    label: pengajuanStatus[value].label,
}))

export default function ListPengajuanJadwalPage() {
    const {
        page, search, orderBy, direction,
        searchTemp, setSearchTemp,
        toggleSort, updateFilter, removeFilter, activeFilters,
    } = useListParams(FILTER_KEYS)

    const { data, mutate, error, isLoading } = usePengajuanJadwal({
        page,
        search,
        ...activeFilters,
        order_by: orderBy,
        direction,
    })

    /**
     * The DB enum is pending|diterima|ditolak. This used to PATCH the display
     * strings "Disetujui"/"Ditolak", which matched no branch on the way back,
     * and it merged the raw axios response into the row instead of its payload.
     */
    const updateStatus = async (id: number, status: PengajuanStatus) => {
        try {
            await mutate(
                async (current) => {
                    const response = await api.patch(`/pengajuan-jadwal/${id}`, { status })
                    const updated = response.data?.data ?? { status }

                    if (!current) return current
                    return {
                        ...current,
                        data: current.data?.map((item) =>
                            item.id === id ? { ...item, ...updated } : item
                        ),
                    }
                },
                {
                    optimisticData: (current) => ({
                        ...(current as PaginatedResponse<PengajuanJadwal>),
                        data: (current?.data ?? []).map((item) =>
                            item.id === id ? { ...item, status } : item
                        ),
                    }),
                    revalidate: false,
                    rollbackOnError: true,
                    populateCache: true,
                }
            )
            toast.success(`Pengajuan ${pengajuanStatus[status].label.toLowerCase()}`)
        } catch {
            toast.error('Gagal memperbarui status pengajuan')
        }
    }

    const columns: Column<PengajuanJadwal>[] = [
        { key: 'kelas', header: 'Kelas', cellClassName: 'font-medium text-neutral-900', render: (row) => row.jadwal?.kelas?.nama ?? '-' },
        { key: 'mentor', header: 'Mentor', render: (row) => row.jadwal?.kelas?.mentor?.user?.name ?? '-' },
        { key: 'tanggal_sebelum', header: 'Tanggal Sebelum', sortKey: 'tanggal_sebelum', render: (row) => formatDate(row.tanggal_sebelum) },
        { key: 'tanggal_sesudah', header: 'Tanggal Sesudah', sortKey: 'tanggal_sesudah', render: (row) => formatDate(row.tanggal_sesudah) },
        {
            key: 'jam',
            header: 'Jam',
            render: (row) => (
                <div className="flex flex-col gap-0.5">
                    <span className="text-neutral-400 line-through">
                        {formatTimeRange(row.waktu_mulai_sebelum, row.waktu_selesai_sebelum)}
                    </span>
                    <span className="text-neutral-700">
                        {formatTimeRange(row.waktu_mulai_sesudah, row.waktu_selesai_sesudah)}
                    </span>
                </div>
            ),
        },
        { key: 'alasan', header: 'Alasan', cellClassName: 'max-w-xs truncate whitespace-normal', render: (row) => row.alasan || '-' },
        {
            key: 'status',
            header: <span className="sr-only">Status</span>,
            headerClassName: 'relative',
            cellClassName: 'text-right',
            render: (row) => (
                <PengajuanAction
                    status={row.status}
                    onApprove={() => updateStatus(row.id, 'diterima')}
                    onReject={() => updateStatus(row.id, 'ditolak')}
                />
            ),
        },
    ]

    return (
        <div className="space-y-6">
            <PageHeader
                title="Pengajuan Jadwal"
                description="Tinjau permintaan perubahan jadwal dari mentor."
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
                                name: 'status',
                                label: 'Status',
                                placeholder: 'Semua status',
                                options: STATUS_OPTIONS,
                            },
                            { type: 'date', name: 'from', label: 'Dari Tanggal' },
                            { type: 'date', name: 'to', label: 'Sampai Tanggal' },
                        ]}
                    />
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
                    emptyMessage="Belum ada pengajuan jadwal"
                />
            </div>

            <Pagination links={data?.links} from={data?.from} to={data?.to} total={data?.total} />
        </div>
    )
}
