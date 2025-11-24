/* eslint-disable @typescript-eslint/no-explicit-any */
import { ChangeEvent, useState } from 'react'
import Modal from '@/components/modal'
import Label from '@/components/forms/label'
import Input from '@/components/forms/input'
// import 'react-datepicker/dist/react-datepicker.css'
// import InputDate from 'components/forms/input-date'
import moment from 'moment'
import InputDate from '@/components/forms/input-date'
// import { lang } from "config"
import { Filter as FilterIcon } from "@/components/icons/outline"

type FilterProps = {
    data: any
    onSubmit: any
    onRemove: any
}

const Content = ({ data, onSubmit, onRemove }: FilterProps) => {
    const [nama, setNama] = useState(data.nama ?? "")
    const [from, setFrom] = useState(data.from)
    const [to, setTo] = useState(data.to)

    const handleSubmit = (e: any) => {
        e.preventDefault()

        const data = {
            nama,
            from,
            to
        }

        // Filter before passing data to parent
        onSubmit(Object.fromEntries(Object.entries(data).filter(([_, v]) => v != null && v != '')))
    }

    return (
        <form onSubmit={handleSubmit} className="mt-8 space-y-8">
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <div>
                    <Label htmlFor="nama" value="Nama" />
                    <Input onChange={(e: ChangeEvent<HTMLInputElement>) => setNama(e.target.value)} value={nama} id="nama" />
                </div>

                <div></div>

                <div>
                    <Label htmlFor="from" value="From" />
                    <InputDate value={from} onChange={(value) => setFrom(moment(value).format('Y-MM-DD'))} />
                </div>

                <div>
                    <Label htmlFor="to" value="To" />
                    <InputDate value={to} onChange={(value) => setTo(moment(value).format('Y-MM-DD'))} />
                </div>
            </div>
            <div className="flex items-center space-x-2 text-xs">
                <button type="submit" className="items-center px-6 py-3 text-white transition bg-neutral-800 rounded-xl active:hover:scale-90">
                    <span>Filter</span>
                </button>
                <button type="button" onClick={onRemove} className="items-center px-6 py-3 transition border border-neutral-200 bg-neutral-50 rounded-xl active:hover:scale-90">
                    <span>Clear</span>
                </button>
            </div>
        </form>
    )
}

export default function Filter({ data, onSubmit, onRemove }: FilterProps) {
    const [isOpen, setIsOpen] = useState(false)

    const openModal = () => setIsOpen(true)
    const closeModal = () => setIsOpen(false)

    const handleSubmit = (value: any) => {
        closeModal()
        onSubmit(value)
    }

    const handleRemove = () => {
        closeModal()
        onRemove()
    }

    return (
        <>
            <button onClick={openModal} className="inline-flex cursor-pointer items-center px-4 py-3 space-x-2 transition border border-neutral-200 bg-neutral-50 rounded-full active:hover:scale-90">
                <FilterIcon className="w-4 h-4" />
                <span>Filter</span>
                {Object.keys(data).length > 0 && (
                    <span className="inline-flex w-4 h-4 font-semibold rounded-full text-[0.5rem] justify-center items-center text-neutral-200 bg-sky-500">
                        {`${Object.keys(data).length}`}
                    </span>
                )}
            </button>
            <Modal from="top" isOpen={isOpen} onClose={closeModal} title="Filter Data">
                <Content onSubmit={handleSubmit} onRemove={handleRemove} data={data} />
            </Modal>
        </>
    )
}