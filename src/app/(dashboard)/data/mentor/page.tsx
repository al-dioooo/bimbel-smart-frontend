'use client'

// import { swrFetcher } from "@/helpers/swr-fetcher"
// import Link from "next/link"
import moment from "moment"
import { usePathname, useRouter, useSearchParams } from "next/navigation"
import { useEffect, useRef, useState } from "react"

import { AutoHeight } from "@/components/auto-height"
import { CircleDashedPlus, Search } from "@/components/icons/outline"
import MenuAction from "@/components/menu-action"

import OutlineButton from "@/components/buttons/outline"
import { useMentor } from "@/hooks/repositories/use-mentor"
import Filter from "./filter"
import Pagination from "@/components/pagination"
import { ChevronUpDown } from "@/components/icons/dynamic"

export default function ListMentorPage() {
    const router = useRouter()
    const pathname = usePathname()

    // Query parameters
    const searchParams = useSearchParams()
    const [searchTemp, setSearchTemp] = useState(searchParams.get('search') ?? "")

    const searchInput = useRef<any>(undefined)

    const page = searchParams.get('page')
    const search = searchParams.get('search')
    const nama = searchParams.get('nama')
    const from = searchParams.get('from')
    const to = searchParams.get('to')

    const orderBy = searchParams.get('order_by')
    const direction = searchParams.get('direction')

    const { data, mutate, error, isLoading, isValidating } = useMentor({
        page,

        search,
        nama,
        from,
        to,

        order_by: orderBy,
        direction
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

    // Data sort handler
    const toggleSort = (value: string) => {
        const params = new URLSearchParams(searchParams.toString())

        const currentOrder = params.get("order_by")
        const currentDirection = params.get("direction")

        // If switching column OR current direction is null/desc → set asc
        if (currentOrder !== value || !currentDirection || currentDirection === "desc") {
            params.set("order_by", value)
            params.set("direction", "asc")
        } else {
            // Otherwise toggle to desc
            params.set("order_by", value)
            params.set("direction", "desc")
        }

        router.replace(`${pathname}?${params.toString()}`)
    }

    // Data filter handlers
    const updateFilter = (values: Record<string, string | null>) => {
        const params = new URLSearchParams(searchParams.toString())

        // Set new values
        Object.entries(values).forEach(([key, value]) => {
            if (value === null || value === "") {
                params.delete(key)
            } else {
                params.set(key, String(value))
            }
        })

        router.replace(`${pathname}?${params.toString()}`)
    }

    const removeFilter = () => {
        router.replace(pathname)
    }

    return (
        <div className="space-y-6">
            {/* Title */}
            <h1 className="text-3xl font-semibold">List Mentor</h1>

            <div className="space-y-6">
                <div className="flex items-center justify-between text-xs">
                    <div className="flex items-center sm:space-x-2">
                        <div className="relative hidden sm:block">
                            <div className="absolute inset-y-0 flex items-center pl-3 pointer-events-none">
                                <Search className="w-4 h-4" />
                            </div>
                            <input ref={searchInput} onChange={(e) => setSearchTemp(e.target.value)} value={searchTemp} type="text" placeholder="Cari data" autoComplete="off" className="w-64 py-3 pl-8 pr-4 text-xs transition border border-neutral-200 focus:outline-none rounded-full focus:border-sky-400 focus:ring-2 focus:ring-sky-200" />
                        </div>
                        <Filter onSubmit={updateFilter} onRemove={removeFilter} data={Object.fromEntries(Object.entries({ nama, from, to }).filter(([_, v]) => v != null))} />
                    </div>
                    <div className="flex items-center space-x-2">
                        <OutlineButton as="link" href="/data/mentor/create" className="text-xs" icon={<CircleDashedPlus className="w-5 h-5" />}>Tambah Mentor</OutlineButton>
                    </div>
                </div>
                <div className="overflow-x-auto border border-neutral-200 rounded-xl">
                    <AutoHeight>
                        <table className="min-w-full overflow-x-auto divide-y divide-neutral-200">
                            <thead className="bg-neutral-50 rounded-t-3xl">
                                <tr>
                                    <th scope="col" className="cursor-pointer px-6 py-3 text-xs font-medium text-left uppercase text-neutral-500 whitespace-nowrap">
                                        <button className="flex cursor-pointer items-center space-x-1 text-xs font-medium text-left uppercase text-neutral-500" onClick={() => toggleSort('nama')}>
                                            <span>Nama</span>
                                            <span><ChevronUpDown direction={orderBy === ('nama') ? (direction === 'asc' ? 'up' : 'down') : false} className="w-4 h-4" strokeWidth={2} /></span>
                                        </button>
                                    </th>
                                    <th scope="col" className="cursor-pointer px-6 py-3 text-xs font-medium text-left uppercase text-neutral-500 whitespace-nowrap">
                                        <button className="flex cursor-pointer items-center space-x-1 text-xs font-medium text-left uppercase text-neutral-500" onClick={() => toggleSort('kontak')}>
                                            <span>Kontak</span>
                                            <span><ChevronUpDown direction={orderBy === ('kontak') ? (direction === 'asc' ? 'up' : 'down') : false} className="w-4 h-4" strokeWidth={2} /></span>
                                        </button>
                                    </th>
                                    <th scope="col" className="cursor-pointer px-6 py-3 text-xs font-medium text-left uppercase text-neutral-500 whitespace-nowrap">
                                        <button className="flex cursor-pointer items-center space-x-1 text-xs font-medium text-left uppercase text-neutral-500" onClick={() => toggleSort('created_at')}>
                                            <span>Dibuat Pada</span>
                                            <span><ChevronUpDown direction={orderBy === ('created_at') ? (direction === 'asc' ? 'up' : 'down') : false} className="w-4 h-4" strokeWidth={2} /></span>
                                        </button>
                                    </th>
                                    <th scope="col" className="cursor-pointer px-6 py-3 text-xs font-medium text-left uppercase text-neutral-500 whitespace-nowrap">
                                        <button className="flex cursor-pointer items-center space-x-1 text-xs font-medium text-left uppercase text-neutral-500" onClick={() => toggleSort('updated_at')}>
                                            <span>Diubah Pada</span>
                                            <span><ChevronUpDown direction={orderBy === ('updated_at') ? (direction === 'asc' ? 'up' : 'down') : false} className="w-4 h-4" strokeWidth={2} /></span>
                                        </button>
                                    </th>
                                    <th scope="col" className="relative px-6 py-3"><span className="sr-only">Action</span></th>
                                </tr>
                            </thead>
                            <tbody className="bg-white divide-y divide-neutral-200">
                                {/* When loading */}
                                {isLoading && (
                                    <tr className="text-center">
                                        <td colSpan={100} className="px-6 py-4 text-xs text-neutral-500 whitespace-nowrap">
                                            <div className="flex items-center justify-between space-x-4">
                                                <hr className="grow border-current/50" /> <span>Loading Data</span> <hr className="grow border-current/50" />
                                            </div>
                                        </td>
                                    </tr>
                                )}

                                {/* When error */}
                                {error && (
                                    <tr className="text-center">
                                        <td colSpan={100} className="px-6 py-4 text-xs text-red-500 whitespace-nowrap">
                                            <div className="flex items-center justify-between space-x-4">
                                                <hr className="grow border-current/50" /> <span>Error Loading Data</span> <hr className="grow border-current/50" />
                                            </div>
                                        </td>
                                    </tr>
                                )}

                                {/* When there are no list available */}
                                {data?.data?.length === 0 && !search && !isLoading && (
                                    <tr className="text-center">
                                        <td colSpan={100} className="px-6 py-4 text-xs text-neutral-500 whitespace-nowrap">
                                            <div className="flex items-center justify-between space-x-4">
                                                <hr className="grow border-current/50" /> <span>No Data Available</span> <hr className="grow border-current/50" />
                                            </div>
                                        </td>
                                    </tr>
                                )}

                                {/* When there are no list available on searching */}
                                {data?.data?.length === 0 && search && !isLoading && (
                                    <tr className="text-center">
                                        <td colSpan={100} className="px-6 py-4 text-xs text-neutral-500 whitespace-nowrap">
                                            <div className="flex items-center justify-between space-x-4">
                                                <hr className="grow border-current/50" /> <span>No Result</span> <hr className="grow border-current/50" />
                                            </div>
                                        </td>
                                    </tr>
                                )}

                                {(data && data.data && data.data.length > 0) && data.data.map((row) => (
                                    <tr key={row.id} className="hover:bg-neutral-50">
                                        <td className="px-6 py-4 text-xs font-medium text-neutral-900 whitespace-nowrap">
                                            {row.user?.name}
                                        </td>
                                        <td className="px-6 py-4 text-xs text-neutral-500 whitespace-nowrap">
                                            {row.kontak}
                                        </td>
                                        <td className="px-6 py-4 text-xs text-neutral-500 whitespace-nowrap">
                                            {moment(row.created_at).format('MMMM D, YYYY')}
                                        </td>
                                        <td className="px-6 py-4 text-xs text-neutral-500 whitespace-nowrap">
                                            {moment(row.updated_at).format('MMMM D, YYYY')}
                                        </td>
                                        <td className="px-3 py-2 text-xs font-medium text-right whitespace-nowrap">
                                            <div className="inline-flex items-center space-x-2">
                                                <MenuAction detailLink={`/data/mentor/${row.id}`} editLink={`/data/mentor/${row.id}/edit`} deleteLink="" />
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </AutoHeight>
                </div>
            </div>

            <Pagination links={data?.links} from={data?.from} to={data?.to} total={data?.total} />
        </div>
    )
}