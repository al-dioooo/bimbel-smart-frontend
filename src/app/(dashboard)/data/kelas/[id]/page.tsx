'use client'

import { use } from "react"

import PageHeader from "@/components/ui/page-header"
import OutlineButton from "@/components/buttons/outline"
import Pagination from "@/components/pagination"
import { Card } from "@/components/ui/card"
import { ArrowNarrowLeft, Pencil } from "@/components/icons/outline"

import DataTable, { type Column } from "@/components/data/data-table"
import SearchInput from "@/components/data/search-input"
import { useListParams } from "@/components/data/use-list-params"

import { useSiswa } from "@/hooks/repositories/use-siswa"
import { useKelasById } from "@/hooks/repositories/use-kelas"
import type { Siswa } from "@/lib/types"

export default function DetailKelasPage({ params }: { params: Promise<{ id: string }> }) {
    const { id } = use(params)

    const { page, search, orderBy, direction, searchTemp, setSearchTemp, toggleSort } = useListParams()

    const { data: kelas, isLoading: isLoadingKelas } = useKelasById(Number(id))

    // SiswaController now forwards kelas_id, so this really is the class roster.
    // Before, the filter key was dropped server-side and every student showed up.
    const { data: siswaData, error, isLoading } = useSiswa({
        page,
        kelas_id: id,
        search,
        order_by: orderBy,
        direction,
    })

    const columns: Column<Siswa>[] = [
        { key: 'nama', header: 'Nama', sortKey: 'nama', cellClassName: 'font-medium text-neutral-900', render: (row) => row.nama },
        { key: 'kontak', header: 'Kontak', sortKey: 'kontak', render: (row) => row.kontak ?? '-' },
        { key: 'asal_sekolah', header: 'Asal Sekolah', render: (row) => row.asal_sekolah ?? '-' },
        { key: 'nama_wali', header: 'Wali', render: (row) => row.nama_wali ?? '-' },
        {
            key: 'actions',
            header: <span className="sr-only">Aksi</span>,
            headerClassName: 'relative',
            cellClassName: 'text-right',
            render: (row) => (
                <OutlineButton
                    as="link"
                    href={`/data/siswa/${row.id}/edit`}
                    buttonType="secondary"
                    className="text-xs"
                    icon={<Pencil className="w-4 h-4" />}
                >
                    Edit
                </OutlineButton>
            ),
        },
    ]

    return (
        <div className="space-y-6">
            <PageHeader
                title={kelas?.nama ? `Kelas ${kelas.nama}` : 'Detail Kelas'}
                description={isLoadingKelas ? undefined : [kelas?.tingkat, kelas?.mentor?.user?.name].filter(Boolean).join(' · ')}
                action={
                    <div className="flex items-center gap-2">
                        <OutlineButton
                            as="link"
                            href="/data/kelas"
                            buttonType="secondary"
                            className="text-xs"
                            icon={<ArrowNarrowLeft className="w-4 h-4" />}
                        >
                            Kembali
                        </OutlineButton>
                        <OutlineButton
                            as="link"
                            href={`/data/kelas/${id}/edit`}
                            className="text-xs"
                            icon={<Pencil className="w-4 h-4" />}
                        >
                            Edit Kelas
                        </OutlineButton>
                    </div>
                }
            />

            <Card>
                <p className="text-xs font-medium text-neutral-500">Jumlah Siswa</p>
                <p className="mt-1 text-3xl font-bold text-neutral-900">
                    {isLoading ? '—' : (siswaData?.total ?? 0)}
                </p>
            </Card>

            <div className="space-y-6">
                <SearchInput value={searchTemp} onChange={setSearchTemp} placeholder="Cari siswa" />

                <DataTable
                    columns={columns}
                    rows={siswaData?.data}
                    rowKey={(row) => row.id}
                    isLoading={isLoading}
                    error={error}
                    isFiltered={!!search}
                    orderBy={orderBy}
                    direction={direction}
                    onSort={toggleSort}
                    emptyMessage="Belum ada siswa di kelas ini"
                />
            </div>

            <Pagination links={siswaData?.links} from={siswaData?.from} to={siswaData?.to} total={siswaData?.total} />
        </div>
    )
}
