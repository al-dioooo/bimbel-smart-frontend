type Props = {
    icon: React.ReactNode
    label: string
    value: string
    color: "sky" | "green" | "red" | "yellow"
}

export default function DashboardCard({ icon, label, value, color = "sky" }: Props) {
    return (
        <div className={`flex items-center space-x-2 p-2 border border-${color}-200 bg-radial-[at_0%_0%] from-${color}-200 to-${color}-50 rounded-2xl`}>
            {/* Icon */}
            <div className={`p-2 bg-white border rounded-xl border-${color}-200`}>{icon}</div>
            {/* Text */}
            <div className="">
                <p className={`text-sm text-${color}-500 font-semibold`}>{label}</p>
                <p className={`text-xl text-${color}-500 font-bold`}>{value}</p>
            </div>
        </div>
    )
}