'use client'

import { useProgress } from "@bprogress/next"
import { swrFetcher } from "@/helpers/swr-fetcher"
// import Link from "next/link"
import moment from "moment"
import { usePathname, useRouter, useSearchParams } from "next/navigation"
import { useEffect, useRef, useState } from "react"
import useSWR from "swr"

import { AutoHeight } from "@/components/auto-height"
import { CircleDashedPlus, Search } from "@/components/icons/outline"
import MenuAction from "@/components/menu-action"

import PrimaryButton from "@/components/buttons/primary"
import OutlineButton from "@/components/buttons/outline"

export default function ListKelasPage() {
    const router = useRouter()
    const pathname = usePathname()

    // Query parameters
    const searchParams = useSearchParams()
    const [searchTemp, setSearchTemp] = useState(searchParams.get('search') ?? "")

    const searchInput = useRef<any>(undefined)

    const page = searchParams.get('page')
    const search = searchParams.get('search')
    const name = searchParams.get('name')
    const from = searchParams.get('from')
    const to = searchParams.get('to')

    const orderBy = searchParams.get('order_by')
    const direction = searchParams.get('direction')

    const { data, mutate, error, isLoading, isValidating } = useSWR(`/kelas?${searchParams.toString()}`, swrFetcher, {
        // fallbackData: initialData,
        // revalidateOnMount: false
    })

    useEffect(() => {
        const timeOut = setTimeout(() => {
            const current = new URLSearchParams(searchParams.toString())

            if (searchTemp !== search) {
                if (searchTemp !== search) {
                    current.set('search', searchTemp)
                }
            }

            if (searchTemp === "") {
                current.delete('search')
            }

            router.replace(`${pathname}?${current.toString()}`)
        }, 500)

        return () => clearTimeout(timeOut)
    }, [searchTemp])

    const progress = useProgress()

    // useEffect(() => {
    //     progress.start(0, 0, true)
    // }, [])

    return (
        <div className="space-y-6">
            {/* Title */}
            <h1 className="text-3xl font-semibold">List Kelas</h1>

            <div className="space-y-6">
                <div className="flex items-center justify-between text-xs">
                    <div className="flex items-center sm:space-x-2">
                        <div className="relative hidden sm:block">
                            <div className="absolute inset-y-0 flex items-center pl-3 pointer-events-none">
                                <Search className="w-4 h-4" />
                            </div>
                            <input ref={searchInput} onChange={(e) => setSearchTemp(e.target.value)} value={searchTemp} type="text" placeholder="Search Data" autoComplete="off" className="w-64 py-3 pl-8 pr-4 text-xs transition border border-neutral-200 focus:outline-none rounded-full focus:border-sky-400 focus:ring-2 focus:ring-sky-200" />
                        </div>
                        {/* <Filter onSubmit={updateFilter} onRemove={removeFilter} data={Object.fromEntries(Object.entries({ name, from, to }).filter(([_, v]) => v != null))} /> */}
                    </div>
                    <div className="flex items-center space-x-2">
                        <div>
                            <OutlineButton as="link" href="/data/kelas/create" className="text-xs" icon={<CircleDashedPlus className="w-5 h-5" />}>Tambah Kelas</OutlineButton>
                            {/* <Link as="button" href="/data/kelas/create" className="inline-flex items-center px-4 py-3 space-x-2 text-white transition bg-neutral-800 rounded-xl active:hover:scale-90">
                                <Plus className="w-4 h-4" strokeWidth={1.5} />
                                <span>Tambah Kelas</span>
                            </Link> */}
                        </div>
                    </div>
                </div>
                <div className="overflow-x-auto border border-neutral-200 rounded-xl">
                    <AutoHeight>
                        <table className="min-w-full overflow-x-auto divide-y divide-neutral-200">
                            <thead className="bg-neutral-50 rounded-t-3xl">
                                <tr>
                                    <th scope="col" className="px-6 py-3 text-xs font-medium text-left uppercase text-neutral-500 whitespace-nowrap">Nama</th>
                                    <th scope="col" className="px-6 py-3 text-xs font-medium text-left uppercase text-neutral-500 whitespace-nowrap">Tingkat</th>
                                    <th scope="col" className="px-6 py-3 text-xs font-medium text-left uppercase text-neutral-500 whitespace-nowrap">Dibuat Pada</th>
                                    <th scope="col" className="px-6 py-3 text-xs font-medium text-left uppercase text-neutral-500 whitespace-nowrap">Diubah Pada</th>
                                    <th scope="col" className="relative px-6 py-3"><span className="sr-only">Action</span></th>
                                </tr>
                            </thead>
                            <tbody className="bg-white divide-y divide-neutral-200">
                                {/* When loading */}
                                {isLoading && (
                                    <tr className="text-center">
                                        <td colSpan={100} className="px-6 py-4 text-xs text-neutral-500 whitespace-nowrap">
                                            Loading Data
                                        </td>
                                    </tr>
                                )}

                                {/* When there are no list available */}
                                {data?.data?.length === 0 && !search && !isLoading && (
                                    <tr className="text-center">
                                        <td colSpan={100} className="px-6 py-4 text-xs text-neutral-500 whitespace-nowrap">
                                            No Data Available
                                        </td>
                                    </tr>
                                )}

                                {/* When there are no list available on searching */}
                                {data?.data?.length === 0 && search && !isLoading && (
                                    <tr className="text-center">
                                        <td colSpan={100} className="px-6 py-4 text-xs text-neutral-500 whitespace-nowrap">
                                            No Result
                                        </td>
                                    </tr>
                                )}

                                {data?.data?.length > 0 && data?.data.map((row: any, index: number) => (
                                    <tr key={row.id} className="hover:bg-neutral-50">
                                        <td className="px-6 py-4 text-xs font-medium text-neutral-900 whitespace-nowrap">
                                            {row.nama}
                                        </td>
                                        <td className="px-6 py-4 text-xs text-neutral-500 whitespace-nowrap">
                                            {row.tingkat}
                                        </td>
                                        <td className="px-6 py-4 text-xs text-neutral-500 whitespace-nowrap">
                                            {moment(row.created_at).format('MMMM D, YYYY')}
                                        </td>
                                        <td className="px-6 py-4 text-xs text-neutral-500 whitespace-nowrap">
                                            {moment(row.updated_at).format('MMMM D, YYYY')}
                                        </td>
                                        <td className="px-3 py-2 text-xs font-medium text-right whitespace-nowrap">
                                            <div className="inline-flex items-center space-x-2">
                                                <MenuAction detailLink={`/data/kelas/${row.id}`} editLink={`/data/kelas/${row.id}/edit`} deleteLink="" />
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </AutoHeight>
                </div>
            </div>
        </div>
    )
}