export interface User {
    id: number
    name: string
    username: string
    email: string
    role: number
    created_at: string
    updated_at: string
}

export interface Kelas {
    id: number
    nama: string
    tingkat: string
    mentor_id: number
    mentor?: Mentor
    siswa?: Siswa[]
    created_at: string
    updated_at: string
}

export interface Mentor {
    id: number
    user: User
    tempat_tanggal_lahir: string
    nik: string
    npwp: string
    kontak: string
    alamat: string
    created_at: string
    updated_at: string
}

export interface Jadwal {
    id: number
    kelas_id: number
    kelas?: Kelas
    tanggal: Date
    waktu_mulai: string
    waktu_selesai: string
    materi: string
    created_at: string
    updated_at: string
}

export interface Siswa {
    id: number
    nama: string
    kelas_id: number
    kelas?: Kelas
    kontak: string
    alamat: string
    asal_sekolah: string
    nama_wali: string
    kontak_wali: string
    pekerjaan_wali: string
    alamat_wali: string
    tanggal_bergabung: string
    created_at: string
    updated_at: string
}

export interface Pengajuan {
    id: number
    nama: string
    status: string
    created_at: string
    updated_at: string
}

export interface AturanGaji {
    id: number
    kelas_id: number
    kelas?: Kelas
    tarif: number
    created_at: string
    updated_at: string
}

export interface AuthToken {
    token: string
}

export interface ApiResponse<T = unknown> {
    message: string
    data: T
}

export interface PaginatedResponse<T> {
    data: T[]

    current_page: number
    from: number
    last_page: number
    per_page: number
    to: number
    total: number

    links: {
        url: string | null
        label: string
        active: boolean
    }[]
}