import Link from 'next/link'
import moment from 'moment'

import { Bell } from '@/components/icons/outline'
import type { DashboardStats } from '@/lib/types'

/**
 * UC-16 / REQ-070 / REQ-071: on the mentor's dashboard, past sessions whose
 * absensi is missing or incomplete (2b) and today's sessions (2a). Nothing
 * renders when neither applies (2a alternative). Each link opens the absensi
 * grid on the session's kelas and month.
 */
export default function PeringatanAbsensi({ stats }: { stats?: DashboardStats }) {
    const belum = stats?.absensi_belum_diisi ?? []
    const jumlahBelum = stats?.jumlah_absensi_belum_diisi ?? belum.length
    const hariIni = stats?.jadwal_hari_ini ?? []

    if (belum.length === 0 && hariIni.length === 0) return null

    const waktu = (mulai: string, selesai: string) => `${mulai}–${selesai}`
    const isiAbsensi = (kelasId: number, tanggal: string) =>
        `/absensi?kelas_id=${kelasId}&bulan=${moment(tanggal).format('YYYY-MM')}`

    return (
        <section role="status" aria-label="Pengingat absensi" className="rounded-xl border border-amber-200 bg-amber-50 p-4 text-sm text-amber-800">
            <div className="flex items-center gap-2 font-semibold">
                <Bell className="h-5 w-5" />
                Pengingat Absensi
            </div>

            {belum.length > 0 && (
                <div className="mt-3">
                    <p className="font-medium">
                        {jumlahBelum} sesi belum diabsen atau belum lengkap
                    </p>
                    <ul className="mt-1 space-y-1">
                        {belum.map((sesi) => (
                            <li key={sesi.jadwal_id} className="flex flex-wrap items-center justify-between gap-2">
                                <span>
                                    {sesi.kelas}, {moment(sesi.tanggal).format('dddd, D MMMM')} {waktu(sesi.waktu_mulai, sesi.waktu_selesai)}
                                    {sesi.belum_lengkap && <span className="ml-2 rounded-full border border-amber-300 px-2 py-0.5 text-[11px] font-semibold">belum lengkap</span>}
                                </span>
                                <Link href={isiAbsensi(sesi.kelas_id, sesi.tanggal)} className="text-xs font-semibold text-amber-900 underline underline-offset-2">
                                    {sesi.belum_lengkap ? 'Lengkapi absensi' : 'Isi absensi'}
                                </Link>
                            </li>
                        ))}
                        {jumlahBelum > belum.length && (
                            <li className="text-xs">dan {jumlahBelum - belum.length} sesi lainnya.</li>
                        )}
                    </ul>
                </div>
            )}

            {hariIni.length > 0 && (
                <div className="mt-3">
                    <p className="font-medium">Jadwal hari ini</p>
                    <ul className="mt-1 space-y-1">
                        {hariIni.map((sesi) => (
                            <li key={sesi.jadwal_id} className="flex flex-wrap items-center justify-between gap-2">
                                <span>
                                    {sesi.kelas}, {waktu(sesi.waktu_mulai, sesi.waktu_selesai)}
                                    {sesi.materi ? ` (${sesi.materi})` : ''}
                                </span>
                                {sesi.sudah_diabsen ? (
                                    <span className="text-xs font-semibold text-emerald-700">Sudah diabsen</span>
                                ) : (
                                    <Link href={isiAbsensi(sesi.kelas_id, sesi.tanggal)} className="text-xs font-semibold text-amber-900 underline underline-offset-2">
                                        Isi absensi
                                    </Link>
                                )}
                            </li>
                        ))}
                    </ul>
                </div>
            )}
        </section>
    )
}
