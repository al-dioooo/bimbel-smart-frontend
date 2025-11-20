import DashboardCard from "@/components/dashboard-card"
import { Users } from "@/components/icons/outline"

export default function Dashboard() {
    return (
        <div className="space-y-8">
            {/* Title */}
            <h1 className="text-3xl font-semibold">Dashboard</h1>
            <div className="space-y-4">
                <div className="grid grid-cols-3 gap-4">
                    <DashboardCard icon={<Users className="w-8 h-8 text-sky-500" strokeWidth={2} />} label="Murid" value="0" color="sky" />
                    <DashboardCard icon={<Users className="w-8 h-8 text-yellow-500" strokeWidth={2} />} label="Kehadiran Murid" value="0" color="yellow" />
                    <DashboardCard icon={<Users className="w-8 h-8 text-green-500" strokeWidth={2} />} label="Penghasilan" value="0" color="green" />
                </div>
                <div className="grid grid-cols-2 gap-4">

                </div>
                <div></div>
            </div>
            <div className="text-7xl">a</div>
            <div className="text-7xl">a</div>
            <div className="text-7xl">a</div>
            <div className="text-7xl">a</div>
            <div className="text-7xl">a</div>
            <div className="text-7xl">a</div>
            <div className="text-7xl">a</div>
            <div className="text-7xl">a</div>
            <div className="text-7xl">a</div>
        </div>
    )
}
