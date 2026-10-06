'use client'

import { useState } from 'react'
import moment from 'moment'

import Modal from '@/components/modal'
import Label from '@/components/forms/label'
import Input from '@/components/forms/input'
import InputDate from '@/components/forms/input-date'
import PrimaryButton from '@/components/buttons/primary'
import OutlineButton from '@/components/buttons/outline'
import SelectDescription from '@/components/forms/select-description'
import { Filter as FilterIcon } from '@/components/icons/outline'

export type FilterField =
    | { type: 'text'; name: string; label: string; placeholder?: string }
    | { type: 'date'; name: string; label: string }
    | {
        type: 'select'
        name: string
        label: string
        placeholder?: string
        options: SelectOption[]
        isLoading?: boolean
    }

/** Callers normalise their entities to this, so the modal stays entity-agnostic. */
export type SelectOption = {
    value: string | number
    label: string
    description?: string
}

type Props = {
    /** Currently-applied values, keyed by field name. */
    value: Record<string, string>
    fields: FilterField[]
    onSubmit: (values: Record<string, string | null>) => void
    onRemove: () => void
}

/**
 * One config-driven filter, replacing eight near-identical `filter.tsx` files
 * that each hardcoded nama/from/to (and one that had its date fields commented
 * out rather than configured away).
 */
export default function FilterModal({ value, fields, onSubmit, onRemove }: Props) {
    const [isOpen, setIsOpen] = useState(false)
    const [draft, setDraft] = useState<Record<string, string>>(value)

    // Re-seed the draft each time the sheet opens, so cancelling discards edits.
    const openModal = () => {
        setDraft(value)
        setIsOpen(true)
    }

    const activeCount = Object.keys(value).length

    const setField = (name: string, next: string) =>
        setDraft((prev) => ({ ...prev, [name]: next }))

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault()
        const cleaned = Object.fromEntries(
            Object.entries(draft).map(([key, val]) => [key, val === '' ? null : val])
        )
        setIsOpen(false)
        onSubmit(cleaned)
    }

    const handleRemove = () => {
        setDraft({})
        setIsOpen(false)
        onRemove()
    }

    return (
        <>
            <button
                type="button"
                onClick={openModal}
                className="inline-flex cursor-pointer items-center gap-2 px-4 py-2.5 text-xs font-medium transition border border-neutral-200 bg-neutral-50 hover:bg-neutral-100 rounded-full active:scale-95"
            >
                <FilterIcon className="w-4 h-4" />
                <span>Filter</span>
                {activeCount > 0 && (
                    <span className="inline-flex w-4 h-4 font-semibold rounded-full text-[0.625rem] justify-center items-center text-white bg-sky-500">
                        {activeCount}
                    </span>
                )}
            </button>

            <Modal from="top" isOpen={isOpen} onClose={() => setIsOpen(false)} title="Filter Data">
                <form onSubmit={handleSubmit} className="mt-6 space-y-6">
                    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                        {fields.map((field) => (
                            <div key={field.name}>
                                <Label htmlFor={field.name} value={field.label} />

                                {field.type === 'text' && (
                                    <Input
                                        id={field.name}
                                        placeholder={field.placeholder ?? ''}
                                        value={draft[field.name] ?? ''}
                                        onChange={(e) => setField(field.name, e.target.value)}
                                    />
                                )}

                                {field.type === 'date' && (
                                    <InputDate
                                        value={draft[field.name] ? moment(draft[field.name]).toDate() : undefined}
                                        onChange={(next) =>
                                            setField(field.name, next ? moment(next).format('YYYY-MM-DD') : '')
                                        }
                                    />
                                )}

                                {field.type === 'select' && (
                                    <SelectDescription
                                        placeholder={field.placeholder}
                                        isLoading={field.isLoading ?? false}
                                        selection={field.options}
                                        value={draft[field.name] ?? ''}
                                        keyValue={(row: SelectOption) => row.value}
                                        title={(row: SelectOption) => row.label}
                                        description={(row: SelectOption) => row.description ?? ''}
                                        onChange={(next) => setField(field.name, next ? String(next) : '')}
                                    />
                                )}
                            </div>
                        ))}
                    </div>

                    <div className="flex items-center gap-2 text-xs">
                        <PrimaryButton type="submit">Terapkan</PrimaryButton>
                        <OutlineButton type="button" buttonType="secondary" onClick={handleRemove}>
                            Reset
                        </OutlineButton>
                    </div>
                </form>
            </Modal>
        </>
    )
}
