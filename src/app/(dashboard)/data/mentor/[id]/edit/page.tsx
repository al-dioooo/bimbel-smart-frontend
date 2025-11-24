'use client'

import React, { useState } from 'react';
import FormSection from '@/components/forms/form-section'; 
import Input from '@/components/forms/input';              
import Label from '@/components/forms/label';              

interface MentorData {
  username: string;
  email: string;
  password: string;
  nama: string;
  ttl: string;
  telepon: string;
  ktp: string;
  npwp: string;
  alamat: string;
  tingkatKelas: string;
  mapel: string;
  riwayatPendidikan: string;
}

const TambahDataMentorPage: React.FC = () => {
  // 1. Inisialisasi State Formulir
  const [formData, setFormData] = useState<MentorData>({
    username: '',
    email: '',
    password: '',
    nama: '',
    ttl: '',
    telepon: '',
    ktp: '',
    npwp: '',
    alamat: '',
    tingkatKelas: '',
    mapel: '',
    riwayatPendidikan: '',
  });

  // 2. Handler untuk perubahan input
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.id]: e.target.value,
    });
  };

  // 3. Handler untuk submit formulir
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log("Data Mentor yang Disimpan:", formData);
  };

  return (
    <div className="p-8">
      <h1 className="text-3xl font-semibold mb-8">Edit Data Mentor</h1>

      <form onSubmit={handleSubmit} className="space-y-10">

        {/* {Account form} */}
        <FormSection
          title="Account Form"
        >
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
            
            <div>
              <Label htmlFor="username" value="Username" />
              <Input 
                id="username" 
                placeholder="Masukkan Username" 
                value={formData.username} 
                onChange={handleChange} 
              />
            </div>

            <div>
              <Label htmlFor="email" value="Email" />
              <Input 
                id="email" 
                placeholder="Masukkan Email" 
                value={formData.email} 
                onChange={handleChange} 
                type="email"
              />
            </div>

            <div>
              <Label htmlFor="password" value="Password" />
              <Input 
                id="password" 
                placeholder="Masukkan Password" 
                value={formData.password} 
                onChange={handleChange} 
                type="password"
              />
            </div>
          </div>
        </FormSection>

        {/* {Main Form} */}
        <FormSection
          title="Main Form"
        >
          {/* Baris 1: Nama, TTL, Telepon */}
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-3 mb-4">
            <div>
              <Label htmlFor="nama" value="Nama" />
              <Input id="nama" placeholder="Masukkan Nama" value={formData.nama} onChange={handleChange} />
            </div>
            <div>
              <Label htmlFor="ttl" value="Tempat & Tanggal Lahir" />
              <Input id="ttl" placeholder="Masukkan Tempat & Tanggal Lahir" value={formData.ttl} onChange={handleChange} />
            </div>
            <div>
              <Label htmlFor="telepon" value="Nomor Telepon" />
              <Input id="telepon" placeholder="Masukkan Nomor Telepon" value={formData.telepon} onChange={handleChange} type="tel" />
            </div>
          </div>

          {/* Baris 2: KTP, NPWP */}
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-3 mb-4">
            <div>
              <Label htmlFor="ktp" value="Nomor KTP" />
              <Input id="ktp" placeholder="Masukkan KTP" value={formData.ktp} onChange={handleChange} />
            </div>
            <div>
              <Label htmlFor="npwp" value="Nomor NPWP" />
              <Input id="npwp" placeholder="Masukkan NPWP" value={formData.npwp} onChange={handleChange} />
            </div>
            <div></div> 
          </div>

          {/* Baris 3: Alamat (Lebar Penuh) */}
          <div className="sm:col-span-3"> 
            <Label htmlFor="alamat" value="Alamat" />
            <Input id="alamat" placeholder="Masukkan Alamat" value={formData.alamat} onChange={handleChange} />
          </div>

        </FormSection>

        {/* {Additional Form} */}
        <FormSection
          title="Additional Form"
        >
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
            <div>
              <Label htmlFor="tingkatKelas" value="Tingkat Kelas yang Diajar" />
              <Input id="tingkatKelas" placeholder="Masukkan Tingkat Kelas" value={formData.tingkatKelas} onChange={handleChange} />
            </div>
            <div>
              <Label htmlFor="mapel" value="Mata Pelajaran" />
              <Input id="mapel" placeholder="Masukkan Mata Pelajaran" value={formData.mapel} onChange={handleChange} />
            </div>
            <div>
              <Label htmlFor="riwayatPendidikan" value="Riwayat Pendidikan" />
              <Input id="riwayatPendidikan" placeholder="Masukkan Riwayat Pendidikan" value={formData.riwayatPendidikan} onChange={handleChange} />
            </div>
          </div>
        </FormSection>

        {/* --- Tombol Aksi --- */}
        <div className="flex justify-end space-x-4 pt-4">
          <button
            type="button"
            className="px-6 py-2 rounded-md text-gray-700 bg-white border border-gray-300 hover:bg-gray-50 transition"
          >
            Batal
          </button>
          <button
            type="submit"
            className="px-6 py-2 rounded-md text-white bg-blue-500 hover:bg-blue-600 shadow-md transition"
          >
            Simpan Perubahan
          </button>
        </div>
      </form>
    </div>
  );
};

export default TambahDataMentorPage;