'use client'

import { useState } from "react"

export default function ListAbsensi() {
    const [data, setData] = useState<{ data: Array<any>, meta: any } | null>(null)
    const [isLoading, setIsLoading] = useState<boolean>(false)
    const [search, setSearch] = useState<string>("")

    return (
        <div className="space-y-6">
            {/* Title */}
            <h1 className="text-3xl font-semibold">Absensi Siswa</h1>

            <div>
                <div className="overflow-x-auto border border-neutral-200 rounded-xl">
                    <table className="min-w-full overflow-x-auto divide-y divide-neutral-200">
                        <thead className="bg-neutral-50 rounded-t-3xl">
                            <tr>
                                <th scope="col" className="px-6 py-3 text-xs font-medium text-left uppercase text-neutral-500 whitespace-nowrap">No</th>
                                <th scope="col" className="px-6 py-3 text-xs font-medium text-left uppercase text-neutral-500 whitespace-nowrap">Nama</th>
                                <th scope="col" className="px-6 py-3 text-xs font-medium text-left uppercase text-neutral-500 whitespace-nowrap">2/10</th>
                                <th scope="col" className="px-6 py-3 text-xs font-medium text-left uppercase text-neutral-500 whitespace-nowrap">7/10</th>
                                <th scope="col" className="relative px-6 py-3"><span className="sr-only">Action</span></th>
                            </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-neutral-200">
                            {/* When loading */}
                            {isLoading && (
                                <tr className="text-center">
                                    <td colSpan={6} className="px-6 py-4 text-xs text-neutral-500 whitespace-nowrap">
                                        Loading Data
                                    </td>
                                </tr>
                            )}

                            {/* When there are no list available */}
                            {data?.data.length === 0 && !search && !isLoading && (
                                <tr className="text-center">
                                    <td colSpan={6} className="px-6 py-4 text-xs text-neutral-500 whitespace-nowrap">
                                        No Data Available
                                    </td>
                                </tr>
                            )}

                            {/* When there are no list available on searching */}
                            {data?.data.length === 0 && search && !isLoading && (
                                <tr className="text-center">
                                    <td colSpan={6} className="px-6 py-4 text-xs text-neutral-500 whitespace-nowrap">
                                        No Result
                                    </td>
                                </tr>
                            )}

                            {data?.data.length > 0 && data?.data.map((row, index) => (
                                <tr>
                                    <td className="px-6 py-4 text-xs font-medium text-neutral-900 whitespace-nowrap">
                                        {row.name}
                                    </td>
                                    <td className="px-6 py-4 text-xs text-neutral-500 whitespace-nowrap">
                                        {row.phone}
                                    </td>
                                    <td className="px-6 py-4 text-xs text-neutral-500 whitespace-nowrap">
                                        {row.roles.length ? (
                                            <div className="inline-flex items-center space-x-2">
                                                <span>{row.roles[0].name}</span>
                                                {row.roles.length > 1 && (
                                                    <span className="inline-flex px-2 text-xs font-semibold leading-5 text-green-800 bg-green-100 rounded-full">
                                                        {`${row.roles.length - 1}+`}
                                                    </span>
                                                )}
                                            </div>
                                        ) : "-"}
                                    </td>
                                    <td className="px-6 py-4 text-xs text-neutral-500 whitespace-nowrap">
                                        {moment(row.created_at).format('MMMM D, YYYY')}
                                    </td>
                                    <td className="px-6 py-4 text-xs font-medium text-right whitespace-nowrap">
                                        <div className="inline-flex items-center space-x-2">
                                            {can('user.update') && (
                                                <Edit data={row} onSuccess={handleSuccess} />
                                            )}

                                            {can('user.delete') && (
                                                <Delete data={row} onSuccess={handleSuccess} />
                                            )}
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    )
}