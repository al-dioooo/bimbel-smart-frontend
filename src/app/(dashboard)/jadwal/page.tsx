// import Calendar from "@/components/calendar"
import JadwalDashboard from "@/components/jadwalDashboard"
import Calendar from "@/components/calendar"

export default function Jadwal() {
    return (
            <div className="flex space-x-4 items-stretch">
                <div className="pace-y-4 w-9/12 flex flex-col">
                    <div className="h-full">
                        <Calendar />
                    </div>
                </div>
                <div className="space-y-4 w-3/12 flex flex-col">
                    <div className="h-full">
                        <JadwalDashboard />
                    </div>
                </div>
            </div>
    )
}