'use client'

import PrimaryButton from "@/components/buttons/primary"
import Description from "@/components/forms/description"
import FormSection from "@/components/forms/form-section"
import Input from "@/components/forms/input"
import Label from "@/components/forms/label"
import Separator from "@/components/separator"
import { useState } from "react"

export default function CreateKelas() {
    const [errors, setErrors] = useState<any>({})

    const [name, setName] = useState<string>("")
    const [tingkatan, setTingkatan] = useState<string>("")

    return (
        <div className="space-y-8">
            {/* Title */}
            <h1 className="text-3xl font-semibold">Tambah Data Siswa</h1>
            <form className="space-y-6">
                <FormSection title="Main Form">
                    <div className="grid gap-4 sm:grid-cols-3">
                        {/* <div className="col-span-2 sm:col-span-1">
                        <Label htmlFor="image" value="Image" />
                        <InputImage onChange={(value: any) => setImage(value)} aspect="square" id="image" name="image" src={data?.image} error={errors.image} alt="https://placehold.co/400x400/F5F5F5/404040?font=source-sans-pro&text=400x400" />
                        <ErrorMessage error={errors.image} />
                    </div> */}
                        <div>
                            <Label htmlFor="name" value="Nama" />
                            <Input placeholder="Masukkan Nama Siswa" onChange={(e: any) => setName(e.target.value)} value={name} id="name" error={errors.name} />
                            <Description error={errors.name} />
                        </div>
                        <div>
                            <Label htmlFor="ttl" value="Tempat & Tanggal Lahir" />
                            <Input placeholder="Masukkan Tempat & Tanggal Lahir" onChange={(e: any) => setTingkatan(e.target.value)} value={tingkatan} id="ttl" error={errors.tingkatan} />
                            <Description error={errors.tingkatan} />
                        </div>
                        <div>
                            <Label htmlFor="nomortelepon" value="Nomor Telepon" />
                            <Input placeholder="Masukkan Nomor Telepon" onChange={(e: any) => setTingkatan(e.target.value)} value={tingkatan} id="nomortelepon" error={errors.tingkatan} />
                            <Description error={errors.tingkatan} />
                        </div>
                                                
                    </div>

                        <div>
                            <Label htmlFor="alamat" value="Alamat" />
                            <Input placeholder="Masukkan Alamat" onChange={(e: any) => setTingkatan(e.target.value)} value={tingkatan} id="alamat" error={errors.tingkatan} />
                            <Description error={errors.tingkatan} />
                        </div>
                    
                    <div className="grid gap-4 sm:grid-cols-2">
                        {/* <div className="col-span-2 sm:col-span-1">
                        <Label htmlFor="image" value="Image" />
                        <InputImage onChange={(value: any) => setImage(value)} aspect="square" id="image" name="image" src={data?.image} error={errors.image} alt="https://placehold.co/400x400/F5F5F5/404040?font=source-sans-pro&text=400x400" />
                        <ErrorMessage error={errors.image} />
                    </div> */}
                        <div>
                            <Label htmlFor="asalsekolah" value="Asal Sekolah" />
                            <Input placeholder="Masukkan Asal Sekolah" onChange={(e: any) => setName(e.target.value)} value={name} id="asalsekolah" error={errors.name} />
                            <Description error={errors.name} />
                        </div>
                        <div>
                            <Label htmlFor="tingkatkelas" value="Tingkat Kelas" />
                            <Input placeholder="Masukkan Tingkat Kelas" onChange={(e: any) => setTingkatan(e.target.value)} value={tingkatan} id="tingkatkelas" error={errors.tingkatan} />
                            <Description error={errors.tingkatan} />
                        </div>                      
                    </div>
                </FormSection>


                <Separator />
                <FormSection title="Additional Form">
                    <div className="grid gap-4 sm:grid-cols-3">
                        {/* <div className="col-span-2 sm:col-span-1">
                        <Label htmlFor="image" value="Image" />
                        <InputImage onChange={(value: any) => setImage(value)} aspect="square" id="image" name="image" src={data?.image} error={errors.image} alt="https://placehold.co/400x400/F5F5F5/404040?font=source-sans-pro&text=400x400" />
                        <ErrorMessage error={errors.image} />
                    </div> */}
                        <div>
                            <Label htmlFor="namawali" value="Nama Orangtua / Wali" />
                            <Input placeholder="Masukkan Nama Orangtua / Wali" onChange={(e: any) => setName(e.target.value)} value={name} id="namawali" error={errors.name} />
                            <Description error={errors.name} />
                        </div>

                        <div>
                            <Label htmlFor="nomorhp" value="Nomor Handphone" />
                            <Input placeholder="Masukkan Nomor Handphone" onChange={(e: any) => setTingkatan(e.target.value)} value={tingkatan} id="nomorhp" error={errors.tingkatan} />
                            <Description error={errors.tingkatan} />
                        </div>
                        <div>
                            <Label htmlFor="pekerjaan" value="Pekerjaan" />
                            <Input placeholder="Masukkan Pekerjaan" onChange={(e: any) => setTingkatan(e.target.value)} value={tingkatan} id="pekerjaan" error={errors.tingkatan} />
                            <Description error={errors.tingkatan} />
                        </div>
                                                
                    </div>

                        <div>
                            <Label htmlFor="alamatortu" value="Alamat" />
                            <Input placeholder="Masukkan Alamat" onChange={(e: any) => setTingkatan(e.target.value)} value={tingkatan} id="alamatortu" error={errors.tingkatan} />
                            <Description error={errors.tingkatan} />
                        </div>
                    
                </FormSection>
                <div className="flex items-center justify-end text-sm">
                    <PrimaryButton type="submit">Submit</PrimaryButton>
                </div>
            </form>
        </div>
    )
}