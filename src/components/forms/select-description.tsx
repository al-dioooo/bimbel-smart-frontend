/* eslint-disable @typescript-eslint/no-explicit-any */
import { Fragment, ReactNode } from 'react'
import { Listbox, Transition } from '@headlessui/react'
import { Check, ChevronUpDown } from '@/components/icons/outline'

/** Stable reference for "nothing selected", so Listbox sees an unchanged value. */
const NONE: any = {}

type Props = {
    selection?: any[]
    isLoading: boolean
    value?: any
    placeholder?: string
    keyValue?: (row: any) => any
    title: (row: any) => ReactNode
    description?: (row: any) => ReactNode
    onChange?: (value: any) => void
    disabled?: boolean
    error?: boolean | string[]
    reverse?: boolean
}

export default function SelectDescription({ selection = [], isLoading, value, placeholder, keyValue = () => { }, title, description = () => "", onChange = () => { }, disabled = false, error, reverse = false }: Props) {
    // Every call site is controlled: `value` holds the selected row's key and
    // `onChange` writes it back. Looking the row up during render replaces two
    // effects that mirrored it into state — including one that fired
    // `onChange(undefined)` on mount, wiping the parent's value whenever
    // `selection` had not finished loading yet.
    const selected = selection.find((row) => keyValue(row) == value) ?? NONE

    const handleChange = (row: any) => onChange(keyValue(row))

    const hasError = Array.isArray(error) ? error.length > 0 : !!error

    return (
        <Listbox value={selected} onChange={handleChange} disabled={disabled}>
            <div className="relative mt-1">
                <Listbox.Button className={`${hasError ? 'border-red-300' : 'border-neutral-200'} ${!isLoading && title(selected) ? "" : "text-neutral-500"} ${disabled ? "bg-neutral-50 opacity-75" : ""} w-full p-2 text-sm text-left transition border focus:outline-none rounded-xl hover:border-neutral-400 focus:border-neutral-400 focus:ring focus:ring-neutral-200`}>
                    <span className={`block truncate`}>
                        {isLoading ? "Loading Data" : title(selected) ?? placeholder}
                    </span>
                    <span className="absolute inset-y-0 right-0 flex items-center pr-2 pointer-events-none">
                        <ChevronUpDown
                            className="w-5 h-5 text-neutral-400"
                            aria-hidden="true"
                        />
                    </span>
                </Listbox.Button>
                <Transition
                    as={Fragment}
                    leave="transition ease-in duration-100"
                    leaveFrom="opacity-100"
                    leaveTo="opacity-0">
                    <Listbox.Options className="absolute z-50 w-full p-1 mt-1 overflow-auto text-base bg-white border shadow-lg rounded-xl max-h-60 border-neutral-200 focus:outline-none sm:text-sm">
                        {selection.length ? selection?.map((row, index) => (
                            <Listbox.Option
                                key={index}
                                className={({ active }) => `relative cursor-pointer select-none py-2 px-2 rounded-lg ${active ? 'bg-neutral-100 text-neutral-900' : 'text-neutral-900'} transition`}
                                value={row}>
                                {({ selected }) => (
                                    <>
                                        <div className={`${reverse ? "flex-col-reverse" : "flex-col"} flex pr-6`}>
                                            <span className={`block truncate`}>
                                                {title(row)}
                                            </span>
                                            <span className={`block truncate text-xs text-neutral-600`}>
                                                {description(row)}
                                            </span>
                                        </div>
                                        <span className="absolute inset-y-0 right-0 flex items-center pr-2">
                                            <div className={`${selected ? "bg-neutral-600" : "border border-neutral-300"} w-5 h-5 flex items-center justify-center text-white rounded-full`}>
                                                {selected && (<Check className="w-4 h-4" strokeWidth={1.5} aria-hidden="true" />)}
                                            </div>
                                        </span>
                                    </>
                                )}
                            </Listbox.Option>
                        )) : (
                            <div className="relative px-4 py-2 text-xs transition rounded-lg cursor-pointer select-none text-neutral-500">
                                <hr className="border-neutral-200" />
                                <span className="absolute inset-0 flex justify-center"><span className="px-2 bg-white">No Selection</span></span>
                            </div>
                        )}
                    </Listbox.Options>
                </Transition>
            </div>
        </Listbox >
    )
}