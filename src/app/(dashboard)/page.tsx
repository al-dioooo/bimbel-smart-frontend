'use client'

import { useState } from "react"
import moment from "moment"

import PageHeader from "@/components/ui/page-header"
import DashboardCard from "@/components/dashboard-card"
import PieChart from "@/components/pieChart"
import BarChart from "@/components/barChart"
import MiniCalendar from "@/components/miniCalendar"
import PengajuanDashboard from "@/components/pengajuanDashboard"
import JadwalDashboard from "@/components/jadwalDashboard"
import { School, Users, Wallet } from "@/components/icons/outline"

import { useDashboardStats } from "@/hooks/repositories/use-dashboard"
import { formatCurrency, formatNumber } from "@/lib/format"

export default function Dashboard() {
    const [selectedDate, setSelectedDate] = useState(new Date())

    // Every figure on this page used to be a literal: "9", "16", "480.000".
    const { data: stats, isLoading, error } = useDashboardStats()

    const periodLabel = stats?.periode
        ? `${moment(stats.periode.from).format('D MMM')} – ${moment(stats.periode.to).format('D MMM YYYY')}`
        : undefined

    return (
        <div className="space-y-8">
            <PageHeader title="Dashboard" description={periodLabel} />

            {error && (
                <div className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-600">
                    Gagal memuat ringkasan dashboard. Periksa koneksi ke server.
                </div>
            )}

            <div className="flex flex-col gap-4 xl:flex-row xl:items-stretch">
                <div className="space-y-4 w-full xl:w-8/12 flex flex-col">
                    <div className="grid gap-4 sm:grid-cols-3">
                        <DashboardCard
                            icon={<School className="w-8 h-8 text-sky-500" strokeWidth={2} />}
                            label="Murid"
                            value={formatNumber(stats?.total_siswa ?? 0)}
                            color="sky"
                            isLoading={isLoading}
                        />
                        <DashboardCard
                            icon={<Users className="w-8 h-8 text-yellow-500" strokeWidth={2} />}
                            label="Kehadiran Murid"
                            value={formatNumber(stats?.total_kehadiran ?? 0)}
                            color="yellow"
                            isLoading={isLoading}
                        />
                        <DashboardCard
                            icon={<Wallet className="w-8 h-8 text-green-500" strokeWidth={2} />}
                            label="Penghasilan"
                            value={formatCurrency(stats?.penghasilan ?? 0)}
                            color="green"
                            isLoading={isLoading}
                        />
                    </div>

                    <div className="grid gap-4 sm:grid-cols-2">
                        <PieChart
                            percentage={stats?.persentase_kehadiran ?? 0}
                            hadir={stats?.kehadiran.hadir ?? 0}
                            total={stats?.kehadiran.total ?? 0}
                            isLoading={isLoading}
                            error={error}
                        />
                        <BarChart
                            values={{
                                h: stats?.kehadiran.hadir ?? 0,
                                s: stats?.kehadiran.sakit ?? 0,
                                i: stats?.kehadiran.izin ?? 0,
                                a: stats?.kehadiran.alpa ?? 0,
                            }}
                            isLoading={isLoading}
                            error={error}
                        />
                    </div>

                    <div className="h-full">
                        <PengajuanDashboard />
                    </div>
                </div>

                <div className="space-y-4 w-full xl:w-4/12 flex flex-col">
                    <MiniCalendar selectedDate={selectedDate} onSelectDate={setSelectedDate} />
                    <div className="h-full">
                        {/* Picking a day in the calendar now moves this panel. */}
                        <JadwalDashboard
                            date={selectedDate}
                            days={7}
                            title={`Jadwal ${moment(selectedDate).format('D MMMM')}`}
                        />
                    </div>
                </div>
            </div>
        </div>
    )
}
