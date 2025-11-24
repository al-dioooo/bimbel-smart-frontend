'use client'

import {
    Dialog,
    DialogBackdrop,
    DialogClose,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogPanel,
    DialogTitle,
    type DialogFlipDirection,
} from '@/components/base/dialog'
import { ArrowNarrowRight, Search } from '@/components/icons/outline'
import Link from 'next/link'
import OutlineButton from './buttons/outline'
import { Highlight } from './base/highlight'
import { useEffect, useRef, useState } from 'react'

type RadixDialogDemoProps = {
    from: DialogFlipDirection
}

const defaultPageList = [
    {
        href: '/',
        label: 'Dashboard'
    },
    {
        href: '/absensi',
        label: 'Absensi'
    },
    {
        href: '/jadwal',
        label: 'Kalender Jadwal'
    },
    {
        href: '/jadwal/list',
        label: 'List Jadwal'
    },
    {
        href: '/jadwal/pengajuan',
        label: 'Pengajuan Jadwal'
    },
    {
        href: '/aturan-gaji',
        label: 'Aturan Gaji'
    },
    {
        href: '/data/kelas',
        label: 'Kelas'
    },
    {
        href: '/data/mentor',
        label: 'Mentor'
    },
    {
        href: '/data/siswa',
        label: 'Siswa'
    },
    {
        href: '/report/absensi',
        label: 'Report Absensi'
    },
    {
        href: '/report/gaji',
        label: 'Report Gaji'
    }
]

export default function GlobalSearch({ from }: RadixDialogDemoProps) {
    const [isOpen, setIsOpen] = useState(false)
    const [search, setSearch] = useState("")
    const [pageList, setPageList] = useState(defaultPageList)

    const searchInput = useRef<any>(undefined)

    useEffect(() => {
        setPageList(defaultPageList.filter((row) => row.label.includes(search)))
    }, [search])

    useEffect(() => {
        searchInput.current?.focus()
    }, [])

    return (
        <div>
            <button onClick={() => setIsOpen(true)} className="inline-flex cursor-pointer rounded-xl justify-center border border-neutral-200 bg-white/80 px-6 py-3 w-full focus:outline-none">
                <div className="inline-flex items-center space-x-2">
                    <span>
                        <Search className="w-4 h-4" />
                    </span>
                    <span className="text-xs">Cari halaman</span>
                </div>
            </button>

            <Dialog open={isOpen} onClose={() => setIsOpen(false)}>
                <DialogBackdrop className="fixed inset-0 z-50 bg-black/80" />
                <DialogPanel from={from} className="sm:max-w-md min-w-md fixed left-[50%] top-[50%] translate-x-[-50%] translate-y-[-50%] z-50">
                    <div className="inline-flex rounded-xl border border-neutral-200 bg-white/95 w-full">
                        <div className="flex w-full items-center space-x-2">
                            <span className="pl-4">
                                <Search className="w-6 h-6" />
                            </span>
                            <input ref={searchInput} onChange={(e: any) => setSearch(e.target.value)} value={search} className="pr-6 py-3 w-full focus:outline-none" placeholder="Cari halaman" />
                        </div>
                    </div>

                    <div className="mt-4 bg-white rounded-xl p-2 max-h-80 overflow-y-auto">
                        <Highlight hover className="bg-neutral-200 rounded-lg inset-0">
                            {pageList.map((row) => (
                                <Link onClick={() => { setIsOpen(false); setSearch("") }} href={row.href} className="flex items-center justify-between py-2 px-4">
                                    <div className="">{row.label}</div>
                                    <OutlineButton className="pointer-events-none"><ArrowNarrowRight /></OutlineButton>
                                </Link>
                            ))}
                        </Highlight>
                    </div>

                    <DialogClose className="absolute top-3 right-2">
                        <span className="uppercase tracking-widest font-medium border rounded-lg px-4 py-2 text-xs">ESC</span>
                    </DialogClose>
                </DialogPanel>
            </Dialog>
        </div>
    )
}