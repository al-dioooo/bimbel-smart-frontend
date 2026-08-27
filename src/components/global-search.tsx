'use client'

import { useEffect, useMemo, useRef, useState } from 'react'
import Link from 'next/link'

import {
    Dialog,
    DialogBackdrop,
    DialogClose,
    DialogPanel,
    type DialogFlipDirection,
} from '@/components/base/dialog'
import { ArrowNarrowRight, Search } from '@/components/icons/outline'
import { Highlight } from '@/components/base/highlight'

type Props = {
    from: DialogFlipDirection
}

const PAGES = [
    { href: '/', label: 'Dashboard', group: 'Umum' },
    { href: '/absensi', label: 'Absensi', group: 'Absensi' },
    { href: '/report/absensi', label: 'Rekap Absensi', group: 'Absensi' },
    { href: '/jadwal', label: 'Kalender Jadwal', group: 'Jadwal' },
    { href: '/jadwal/list', label: 'List Jadwal', group: 'Jadwal' },
    { href: '/jadwal/pengajuan', label: 'Pengajuan Jadwal', group: 'Jadwal' },
    { href: '/aturan-gaji', label: 'Aturan Gaji', group: 'Gaji' },
    { href: '/report/gaji', label: 'Konversi Gaji Mentor', group: 'Gaji' },
    { href: '/data/kelas', label: 'Kelas', group: 'Data' },
    { href: '/data/mentor', label: 'Mentor', group: 'Data' },
    { href: '/data/siswa', label: 'Siswa', group: 'Data' },
    { href: '/edit-profil', label: 'Edit Profil', group: 'Umum' },
]

export default function GlobalSearch({ from }: Props) {
    const [isOpen, setIsOpen] = useState(false)
    const [search, setSearch] = useState('')

    const searchInput = useRef<HTMLInputElement>(null)

    // The original focused on mount, while the dialog was still closed.
    useEffect(() => {
        if (!isOpen) return
        const id = window.setTimeout(() => searchInput.current?.focus(), 50)
        return () => window.clearTimeout(id)
    }, [isOpen])

    // Cmd/Ctrl+K opens it.
    useEffect(() => {
        const onKeyDown = (e: KeyboardEvent) => {
            if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'k') {
                e.preventDefault()
                setIsOpen(true)
            }
        }
        window.addEventListener('keydown', onKeyDown)
        return () => window.removeEventListener('keydown', onKeyDown)
    }, [])

    // Was case-sensitive `label.includes(search)`.
    const results = useMemo(() => {
        const query = search.trim().toLowerCase()
        if (!query) return PAGES
        return PAGES.filter(
            (page) =>
                page.label.toLowerCase().includes(query) ||
                page.group.toLowerCase().includes(query)
        )
    }, [search])

    const close = () => {
        setIsOpen(false)
        setSearch('')
    }

    return (
        <div>
            <button
                type="button"
                onClick={() => setIsOpen(true)}
                className="inline-flex cursor-pointer rounded-xl items-center justify-between border border-neutral-200 bg-white/80 hover:bg-white px-4 py-2.5 w-full transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-sky-200"
            >
                <span className="inline-flex items-center gap-2 text-neutral-500">
                    <Search className="w-4 h-4" />
                    <span className="text-xs">Cari halaman</span>
                </span>
                <kbd className="hidden sm:inline-flex items-center rounded border border-neutral-200 bg-neutral-50 px-1.5 py-0.5 text-[10px] font-medium text-neutral-500">
                    ⌘K
                </kbd>
            </button>

            <Dialog open={isOpen} onClose={close}>
                <DialogBackdrop className="fixed inset-0 z-50 bg-black/60" />
                <DialogPanel
                    from={from}
                    className="fixed left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 z-50 w-[calc(100vw-2rem)] sm:max-w-md"
                >
                    <div className="rounded-xl border border-neutral-200 bg-white shadow-xl overflow-hidden">
                        <div className="flex items-center gap-2 border-b border-neutral-200 px-4">
                            <Search className="w-5 h-5 shrink-0 text-neutral-400" />
                            <input
                                ref={searchInput}
                                value={search}
                                onChange={(e) => setSearch(e.target.value)}
                                className="py-3 w-full text-sm focus:outline-none"
                                placeholder="Cari halaman"
                            />
                            {/* Sits inside the row now, rather than on top of the input. */}
                            <DialogClose className="shrink-0">
                                <span className="uppercase tracking-widest font-medium border border-neutral-200 rounded-md px-2 py-1 text-[10px] text-neutral-500">
                                    ESC
                                </span>
                            </DialogClose>
                        </div>

                        <div className="p-2 max-h-80 overflow-y-auto">
                            {results.length === 0 ? (
                                <p className="px-4 py-8 text-center text-xs text-neutral-400">
                                    Halaman tidak ditemukan
                                </p>
                            ) : (
                                <Highlight hover className="bg-neutral-100 rounded-lg inset-0">
                                    {results.map((row) => (
                                        // The mapped element had no key.
                                        <Link
                                            key={row.href}
                                            onClick={close}
                                            href={row.href}
                                            className="flex items-center justify-between gap-4 py-2 px-3 rounded-lg"
                                        >
                                            <span className="flex flex-col">
                                                <span className="text-sm text-neutral-900">{row.label}</span>
                                                <span className="text-[10px] uppercase tracking-wide text-neutral-400">{row.group}</span>
                                            </span>
                                            <ArrowNarrowRight className="w-4 h-4 shrink-0 text-neutral-400" />
                                        </Link>
                                    ))}
                                </Highlight>
                            )}
                        </div>
                    </div>
                </DialogPanel>
            </Dialog>
        </div>
    )
}
