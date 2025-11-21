import DashboardCard from "@/components/dashboard-card"
import { Users } from "@/components/icons/outline"
import PieChart from "@/components/pieChart"
import BarChart from "@/components/barChart"
import MiniCalendar from "@/components/miniCalendar"
import PengajuanDashboard from "@/components/pengajuanDashboard"
// import Calendar from "@/components/calendar"
import JadwalDashboard from "@/components/jadwalDashboard"

export default function Dashboard() {
    return (
        <div className="space-y-8">
            {/* Title */}
            {/* <h1 className="text-3xl font-semibold">Dashboard</h1> */}
            <div className="flex space-x-4 items-stretch">
                <div className="space-y-4 w-9/12 flex flex-col">
                    <div className="grid grid-cols-3 gap-4">
                        <DashboardCard icon={<Users className="w-8 h-8 text-sky-500" strokeWidth={2} />} label="Murid" value="0" color="sky" />
                        <DashboardCard icon={<Users className="w-8 h-8 text-yellow-500" strokeWidth={2} />} label="Kehadiran Murid" value="0" color="yellow" />
                        <DashboardCard icon={<Users className="w-8 h-8 text-green-500" strokeWidth={2} />} label="Penghasilan" value="0" color="green" />
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                        <PieChart />
                        <BarChart />
                    </div>
                    <div className="h-full">
                        <PengajuanDashboard />
                    </div>
                </div>
                <div className="space-y-4 w-3/12 flex flex-col">
                    <div className="">
                        <MiniCalendar />
                    </div>
                    <div className="h-full">
                        <JadwalDashboard />
                    </div>
                </div>
            </div>
        </div>
    )
}
