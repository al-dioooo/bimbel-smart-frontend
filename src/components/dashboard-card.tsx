import { cn } from "@/lib/utils"

type CardColor = "sky" | "green" | "red" | "yellow"

/**
 * Explicit maps rather than `border-${color}-200` interpolation — Tailwind
 * cannot see constructed class names, which is why globals.css used to carry
 * an `@source inline(...)` safelist.
 */
const shell: Record<CardColor, string> = {
    sky: "border-sky-200 from-sky-200 to-sky-50",
    green: "border-green-200 from-green-200 to-green-50",
    red: "border-red-200 from-red-200 to-red-50",
    yellow: "border-yellow-200 from-yellow-200 to-yellow-50",
}

const iconRing: Record<CardColor, string> = {
    sky: "border-sky-200",
    green: "border-green-200",
    red: "border-red-200",
    yellow: "border-yellow-200",
}

const text: Record<CardColor, string> = {
    sky: "text-sky-500",
    green: "text-green-500",
    red: "text-red-500",
    yellow: "text-yellow-500",
}

type Props = {
    icon: React.ReactNode
    label: string
    value: React.ReactNode
    color?: CardColor
    isLoading?: boolean
}

export default function DashboardCard({ icon, label, value, color = "sky", isLoading = false }: Props) {
    return (
        <div className={cn("flex items-center space-x-2 p-2 border bg-radial-[at_0%_0%] rounded-xl", shell[color])}>
            <div className={cn("p-2 bg-white border rounded-xl", iconRing[color])}>{icon}</div>
            <div className="min-w-0">
                <p className={cn("text-sm font-semibold truncate", text[color])}>{label}</p>
                {isLoading ? (
                    <div className="mt-1 h-6 w-20 rounded bg-white/60 animate-pulse" />
                ) : (
                    <p className={cn("text-xl font-bold", text[color])}>{value}</p>
                )}
            </div>
        </div>
    )
}
