import { useState } from 'react'
import { Modal } from 'components'
import Label from 'components/forms/label'
import Input from 'components/forms/input'
import InputAmount from 'components/forms/input-amount'
import 'react-datepicker/dist/react-datepicker.css'
import InputDate from 'components/forms/input-date'
import moment from 'moment'
import { lang } from "config"

type FilterProps = {
    data: any
    onSubmit: any
    onRemove: any
}

const Content = ({ data, onSubmit, onRemove }: FilterProps) => {
    const [name, setName] = useState(data.name)
    const [from, setFrom] = useState(data.from)
    const [to, setTo] = useState(data.to)

    const handleSubmit = (e) => {
        e.preventDefault()

        const data = {
            name,
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
                    <Label htmlFor="name" value={lang.name} />
                    <Input onChange={e => setName(e.target.value)} value={name} id="name" />
                </div>

                <div></div>

                <div>
                    <Label htmlFor="from" value={lang.from} />
                    <InputDate id="from" maxDate={Date.parse(to)} onChange={(value) => setFrom(moment(value).format('Y-MM-DD'))} value={Date.parse(from)} selected={Date.parse(from)} />
                </div>

                <div>
                    <Label htmlFor="to" value={lang.to} />
                    <InputDate id="to" minDate={Date.parse(from)} onChange={(value) => setTo(moment(value).format('Y-MM-DD'))} value={Date.parse(to)} selected={Date.parse(to)} />
                </div>
            </div>
            <div className="flex items-center space-x-2 text-xs">
                <button type="submit" className="items-center px-6 py-3 text-white transition bg-neutral-800 rounded-xl active:hover:scale-90">
                    <span>{lang.filter}</span>
                </button>
                <button type="button" onClick={onRemove} className="items-center px-6 py-3 transition border border-neutral-200 bg-neutral-50 rounded-xl active:hover:scale-90">
                    <span>{lang.clear}</span>
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
            <button onClick={openModal} className="inline-flex items-center px-4 py-3 space-x-2 transition border border-neutral-200 bg-neutral-50 rounded-xl active:hover:scale-90">
                <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4" width={24} height={24} viewBox="0 0 24 24" strokeWidth={1} stroke="currentColor" fill="none" strokeLinecap="round" strokeLinejoin="round">
                    <path stroke="none" d="M0 0h24v24H0z" fill="none"></path>
                    <path d="M5.5 5h13a1 1 0 0 1 .5 1.5l-5 5.5l0 7l-4 -3l0 -4l-5 -5.5a1 1 0 0 1 .5 -1.5"></path>
                </svg>
                <span>{lang.filter}</span>
                {Object.keys(data).length > 0 && (
                    <span className="inline-flex w-4 h-4 font-semibold rounded-full text-[0.5rem] justify-center text-neutral-200 bg-neutral-800">
                        {`${Object.keys(data).length}`}
                    </span>
                )}
            </button>
            <Modal isOpen={isOpen} onClose={closeModal} title={`${lang.filter} ${lang.data}`} content={<Content onSubmit={handleSubmit} onRemove={handleRemove} data={data} />} />
        </>
    )
}