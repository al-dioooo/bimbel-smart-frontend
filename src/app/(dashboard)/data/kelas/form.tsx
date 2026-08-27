import { FormEvent, useEffect, useRef, useState } from "react"

import PrimaryButton from "@/components/buttons/primary"
import Description from "@/components/forms/description"
import FormSection from "@/components/forms/form-section"
import Input from "@/components/forms/input"
import Label from "@/components/forms/label"
import Separator from "@/components/separator"

import { Kelas, Siswa } from "@/lib/types"
import { AutoHeight } from "@/components/auto-height"
import OutlineButton from "@/components/buttons/outline"
import { CircleDashedPlus, Search, Trash } from "@/components/icons/outline"
import Modal from "@/components/modal"
import { useSiswa } from "@/hooks/repositories/use-siswa"
import { Checkbox, CheckboxIndicator } from "@/components/forms/checkbox"
import Pagination from "@/components/pagination"
import { useMentor } from "@/hooks/repositories/use-mentor"
import SelectDescription from "@/components/forms/select-description"

type Props = {
    data?: Kelas
    isLoading?: boolean
    onSubmit: (value: Record<string, unknown>) => void
    errors: Record<string, string[]>
}

type SiswaSelectorProps = {
    data?: Siswa[]
    onSubmit: (value: Siswa[]) => void
}

const SiswaSelector = ({ data, onSubmit }: SiswaSelectorProps) => {
    const [isOpen, setIsOpen] = useState(false)
    const [selectedSiswa, setSelectedSiswa] = useState<Siswa[] | null>(data ?? null)

    const openModal = () => setIsOpen(true)
    const closeModal = () => {
        setIsOpen(false)
        setPage(1)
        setSearchTemp("")
    }

    const searchInput = useRef<HTMLInputElement>(null)
    const [searchTemp, setSearchTemp] = useState<string>("")
    const [search, setSearch] = useState<string | null>("")
    const [page, setPage] = useState<number>(1)

    useEffect(() => {
        setSelectedSiswa(data ?? null)
    }, [data])

    useEffect(() => {
        const timeOut = setTimeout(() => {
            setSearch(searchTemp)
        }, 500)

        return () => clearTimeout(timeOut)
    }, [searchTemp])

    const toggleSelectedSiswa = (siswa: Siswa) => {
        const updatedSelectedSiswa = selectedSiswa ? [...selectedSiswa] : []

        const index = updatedSelectedSiswa.findIndex((item) => item.id === siswa.id)
        if (index > -1) {
            // If already selected, remove it
            updatedSelectedSiswa.splice(index, 1)
        } else {
            // If not selected, add it
            updatedSelectedSiswa.push(siswa)
        }

        setSelectedSiswa(updatedSelectedSiswa)
    }

    const { data: siswaDataList } = useSiswa({
        page,
        search,
        no_kelas: true
    })

    const updatePage = (value: number) => {
        setPage(value)
    }

    const handleSubmit = (value: Siswa[] | null) => {
        closeModal()
        onSubmit(value ?? [])
    }

    return (
        <>
            <OutlineButton type="button" onClick={openModal} className="text-xs" icon={<CircleDashedPlus className="w-5 h-5" />}>Tambah Siswa</OutlineButton>
            <Modal size="3xl" from="top" isOpen={isOpen} onClose={closeModal} title="Pilih Siswa">
                <div className="mt-8 space-y-6">
                    <div>
                        <div className="relative hidden sm:block">
                            <div className="absolute inset-y-0 flex items-center pl-3 pointer-events-none">
                                <Search className="w-4 h-4" />
                            </div>
                            <input ref={searchInput} onChange={(e) => setSearchTemp(e.target.value)} value={searchTemp} type="text" placeholder="Cari data" autoComplete="off" className="w-64 py-3 pl-8 pr-4 text-xs transition border border-neutral-200 focus:outline-none rounded-full focus:border-sky-400 focus:ring-2 focus:ring-sky-200" />
                        </div>
                    </div>
                    <div className="overflow-x-auto border border-neutral-200 rounded-xl">
                        <AutoHeight>
                            <table className="min-w-full overflow-x-auto divide-y divide-neutral-200">
                                <thead className="bg-neutral-50 rounded-t-3xl">
                                    <tr>
                                        <th scope="col" className="px-6 py-3 text-xs font-medium text-left uppercase text-neutral-500 whitespace-nowrap">Nama</th>
                                        <th scope="col" className="px-6 py-3 text-xs font-medium text-left uppercase text-neutral-500 whitespace-nowrap">Kontak</th>
                                        <th scope="col" className="relative px-6 py-3"><span className="sr-only">Action</span></th>
                                    </tr>
                                </thead>
                                <tbody className="bg-white divide-y divide-neutral-200">
                                    {/* When there are no list available */}
                                    {!siswaDataList?.data?.length && (
                                        <tr className="text-center">
                                            <td colSpan={100} className="px-6 py-4 text-xs text-neutral-500 whitespace-nowrap">
                                                <div className="flex items-center justify-between space-x-4">
                                                    <hr className="grow border-current/50" /> <span>No Data Available</span> <hr className="grow border-current/50" />
                                                </div>
                                            </td>
                                        </tr>
                                    )}

                                    {(siswaDataList && siswaDataList.data && siswaDataList.data.length > 0) && siswaDataList.data.map((row) => (
                                        <tr key={row.id} onClick={() => toggleSelectedSiswa(row)} className="hover:bg-neutral-50 cursor-pointer">
                                            <td className="px-6 py-4 text-xs font-medium text-neutral-900 whitespace-nowrap">
                                                {row.nama}
                                            </td>
                                            <td className="px-6 py-4 text-xs text-neutral-500 whitespace-nowrap">
                                                {row.kontak}
                                            </td>
                                            <td className="px-3 py-2 text-xs font-medium text-right whitespace-nowrap">
                                                <Checkbox disabled className="size-5 flex justify-center items-center border rounded-full [&[data-checked],&[data-indeterminate]]:bg-sky-500 [&[data-checked],&[data-indeterminate]]:text-primary-foreground transition-colors duration-500" nativeButton checked={selectedSiswa?.find((siswa) => siswa.id === row.id) ? true : false}>
                                                    <CheckboxIndicator className="size-2.5" />
                                                </Checkbox>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </AutoHeight>
                    </div>
                    <Pagination onNavigate={updatePage} current={page} links={siswaDataList?.links} from={siswaDataList?.from} to={siswaDataList?.to} total={siswaDataList?.total} />

                    <PrimaryButton type="button" onClick={() => handleSubmit(selectedSiswa)} centerText className="text-sm w-full">Simpan</PrimaryButton>
                </div>
            </Modal>
        </>
    )
}

export default function Form({ data, isLoading = false, onSubmit, errors }: Props) {
    const [nama, setNama] = useState<string>("")
    const [tingkat, setTingkat] = useState<string>("")
    const [mentor, setMentor] = useState<number>()

    const [selectedSiswa, setSelectedSiswa] = useState<Siswa[] | null>(data?.siswa ?? null)

    const { data: mentorDataList, isLoading: isLoadingMentorDataList } = useMentor({
        paginate: false
    })

    useEffect(() => {
        if (data && !isLoading) {
            setNama(data.nama)
            setTingkat(data.tingkat)
            setMentor(data.mentor_id)
            setSelectedSiswa(data.siswa ?? null)
        }
    }, [data, isLoading])

    const updateSelectedSiswa = (value: Siswa[]) => {
        setSelectedSiswa(value)
    }

    const removeSelectedSiswa = (siswa: Siswa) => {
        if (!selectedSiswa) return

        const updatedSelectedSiswa = selectedSiswa.filter((item) => item.id !== siswa.id)
        setSelectedSiswa(updatedSelectedSiswa)
    }

    const submitHandler = (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault()

        const data = {
            nama,
            tingkat,
            mentor_id: mentor,

            siswa: selectedSiswa?.map((row) => row.id) || []
        }

        onSubmit(data)
    }

    return (
        <form className="space-y-6" onSubmit={submitHandler} method="POST">
            <FormSection title="Data Utama">
                <div className="grid gap-4 sm:grid-cols-2">
                    <div>
                        <Label htmlFor="nama" value="Nama" />
                        <Input placeholder="Masukkan data nama" onChange={(e) => setNama(e.target.value)} value={nama} id="nama" error={errors.nama} />
                        <Description value="" error={errors.nama} />
                    </div>
                    <div>
                        <Label htmlFor="tingkat" value="Tingkat" />
                        <Input placeholder="Masukan data tingkat kelas" onChange={(e) => setTingkat(e.target.value)} value={tingkat} id="tingkat" error={errors.tingkat} />
                        <Description value="" error={errors.tingkat} />
                    </div>
                    <div>
                        <Label htmlFor="mentor_id" value="Mentor" />
                        {/* @ts-expect-error SelectDescription is intentionally untyped over its selection rows */}
                        <SelectDescription placeholder="Pilih Mentor" title={(value) => value?.user?.name} isLoading={isLoadingMentorDataList} description={(value) => value.kontak} onChange={(value: unknown) => setMentor(value)} keyValue={(value) => value.id} value={mentor} error={errors.mentor_id} selection={mentorDataList} />
                        <Description value="" error={errors.mentor_id} />
                    </div>
                </div>
            </FormSection>

            <Separator />

            <FormSection title="Siswa" description="Data siswa yang berada pada kelas" disablePadding>
                <div className="space-y-6">
                    <div className="overflow-x-auto border border-neutral-200 rounded-xl">
                        <AutoHeight>
                            <table className="min-w-full overflow-x-auto divide-y divide-neutral-200">
                                <thead className="bg-neutral-50 rounded-t-3xl">
                                    <tr>
                                        <th scope="col" className="px-6 py-3 text-xs font-medium text-left uppercase text-neutral-500 whitespace-nowrap">Nama</th>
                                        <th scope="col" className="px-6 py-3 text-xs font-medium text-left uppercase text-neutral-500 whitespace-nowrap">Kontak</th>
                                        <th scope="col" className="relative px-6 py-3"><span className="sr-only">Action</span></th>
                                    </tr>
                                </thead>
                                <tbody className="bg-white divide-y divide-neutral-200">
                                    {/* When there are no list available */}
                                    {!selectedSiswa?.length && (
                                        <tr className="text-center">
                                            <td colSpan={100} className="px-6 py-4 text-xs text-neutral-500 whitespace-nowrap">
                                                <div className="flex items-center justify-between space-x-4">
                                                    <hr className="grow border-current/50" /> <span>No Data Available</span> <hr className="grow border-current/50" />
                                                </div>
                                            </td>
                                        </tr>
                                    )}

                                    {(selectedSiswa && selectedSiswa.length > 0) && selectedSiswa.map((row) => (
                                        <tr key={row.id} className="hover:bg-neutral-50">
                                            <td className="px-6 py-4 text-xs font-medium text-neutral-900 whitespace-nowrap">
                                                {row.nama}
                                            </td>
                                            <td className="px-6 py-4 text-xs text-neutral-500 whitespace-nowrap">
                                                {row.kontak}
                                            </td>
                                            <td className="px-3 py-2 text-xs font-medium text-right whitespace-nowrap">
                                                <OutlineButton onClick={() => removeSelectedSiswa(row)} type="button" buttonType="danger" className="text-xs" icon={<Trash className="w-5 h-5" />}>Delete</OutlineButton>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </AutoHeight>
                    </div>

                    <SiswaSelector data={selectedSiswa ?? undefined} onSubmit={updateSelectedSiswa} />
                </div>
            </FormSection>

            <div className="flex items-center justify-end text-sm">
                <PrimaryButton type="submit">Submit</PrimaryButton>
            </div>
        </form>
    )
}