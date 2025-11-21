import Calendar from "@/components/calendar"
import JadwalDashboard from "@/components/jadwalDashboard"

export default function Jadwal() {
    return (
            <div className="flex space-x-4">
                <div className="space-y-4 w-2/3">
                    <div className="">
                        <Calendar />
                    </div>
                </div>
                <div className="space-y-4 w-1/3">
                    <div className="">
                        <JadwalDashboard />
                    </div>
                </div>
            </div>
    )
}