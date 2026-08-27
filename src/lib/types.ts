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

export interface PengajuanJadwal {
    id: number
    jadwal_id: number
    jadwal: Jadwal
    tanggal_sebelum: string
    tanggal_sesudah: string
    waktu_mulai_sebelum: string
    waktu_mulai_sesudah: string
    waktu_selesai_sebelum: string
    waktu_selesai_sesudah: string
    alasan: string
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

export interface Notification {
    id: number
    user_id: number
    user?: User
    icon: string
    title: string
    message: string
    link: string
    is_read: boolean
    created_at: string
    updated_at: string
}

/** Derived on read by ReportAbsensiController — there is no report_absensi table. */
export interface ReportAbsensiRow {
    kelas_id: number
    kelas: string
    tingkat: string | null
    mentor: string | null
    tahun: number
    bulan: number
    hadir: number
    sakit: number
    izin: number
    alpa: number
    total: number
}

export interface ReportAbsensiSiswaRow {
    siswa_id: number
    siswa: string
    hadir: number
    sakit: number
    izin: number
    alpa: number
    total: number
}

export interface ReportAbsensiDetail {
    kelas: {
        id: number
        nama: string
        tingkat: string | null
        mentor: string | null
    } | null
    rekap: PaginatedResponse<ReportAbsensiSiswaRow>
}

/** Derived on read by ReportGajiController. */
export interface ReportGajiRow {
    mentor_id: number
    mentor: string
    tahun: number
    bulan: number
    total_kehadiran_murid: number
    nominal: number
}

export interface ReportGajiDetailRow {
    kelas_id: number
    kelas: string
    mentor: string
    tahun: number
    bulan: number
    tarif: number
    jumlah_kehadiran: number
    nominal: number
}

export interface DashboardStats {
    periode: { from: string; to: string }
    total_siswa: number
    total_kehadiran: number
    penghasilan: number
    persentase_kehadiran: number
    kehadiran: {
        hadir: number
        sakit: number
        izin: number
        alpa: number
        total: number
    }
}

export interface Absensi {
    id: number
    jadwal_id: number
    siswa_id: number
    jadwal?: Jadwal
    siswa?: Siswa
    tanggal: string
    status: string
    is_open: boolean
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