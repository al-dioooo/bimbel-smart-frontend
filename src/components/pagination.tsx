import { ArrowNarrowLeft, ArrowNarrowRight } from "@/components/icons/outline"
import Link from "next/link"

type Props = {
    links: Array<{
        url: string | null
        label: string
        active: boolean
    }>
    from: number
    to: number
    total: number
}

export default function Pagination({ links, from, to, total }: Props) {
    if (links?.length > 3) {
        return (
            <div className="flex items-center flex-wrap gap-4 justify-between w-full">
                <div className="flex flex-wrap -mb-1">
                    {links.map((row, index) => (
                        <>
                            {index === 0 ? (
                                row.url === null ? (
                                    <div className="px-4 py-2 mb-1 mr-1 text-sm leading-4 text-neutral-400 border rounded-xl"><ArrowNarrowLeft className="w-6 h-6" /></div>
                                ) : (
                                    <Link href={row.url} className={`${row.active ? 'bg-neutral-800 text-white hover:bg-neutral-700' : 'hover:bg-neutral-100'} px-4 py-2 mb-1 mr-1 text-sm leading-4 transition border rounded-xl focus:border-neutral-500 active:hover:scale-95`}><ArrowNarrowLeft className="w-6 h-6" /></Link>
                                )
                            ) : (index === links.length - 1 ? (
                                row.url === null ? (
                                    <div className="px-4 py-2 mb-1 mr-1 text-sm leading-4 text-neutral-400 border rounded-xl"><ArrowNarrowRight className="w-6 h-6" /></div>
                                ) : (
                                    <Link href={row.url} className={`${row.active ? 'bg-neutral-800 text-white hover:bg-neutral-700' : 'hover:bg-neutral-100'} px-4 py-2 mb-1 mr-1 text-sm leading-4 transition border rounded-xl focus:border-neutral-500 active:hover:scale-95`}><ArrowNarrowRight className="w-6 h-6" /></Link>
                                )
                            ) : (
                                row.url === null ? (
                                    <div className="px-4 py-3 mb-1 mr-1 text-sm leading-4 text-neutral-400 border rounded-xl">{row.label}</div>
                                ) : (
                                    <Link href={row.url} className={`${row.active ? 'bg-neutral-800 text-white hover:bg-neutral-700' : 'hover:bg-neutral-100'} px-4 py-3 mb-1 mr-1 text-sm leading-4 transition border rounded-xl focus:border-neutral-500 active:hover:scale-95`}>{row.label}</Link>
                                )
                            ))}
                        </>
                    ))}
                </div>

                <div>
                    <p className="text-sm leading-5 text-neutral-700">
                        Showing
                        <span className="font-medium">{` ${from} `}</span>
                        to
                        <span className="font-medium">{` ${to} `}</span>
                        of
                        <span className="font-medium">{` ${total} `}</span>
                        results
                    </p>
                </div>
            </div>
        )
    }
}