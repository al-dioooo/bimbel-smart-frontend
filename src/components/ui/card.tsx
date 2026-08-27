import { cn } from "@/lib/utils"

type CardProps = {
    children: React.ReactNode
    className?: string
    /** Drops the inner padding — use for cards that wrap a table. */
    flush?: boolean
}

/** The portal's single surface treatment: white, neutral-200 hairline, rounded-xl. */
export function Card({ children, className, flush = false }: CardProps) {
    return (
        <div
            className={cn(
                "bg-white border border-neutral-200 rounded-xl",
                flush ? "overflow-hidden" : "p-4",
                className
            )}
        >
            {children}
        </div>
    )
}

type CardHeaderProps = {
    title: React.ReactNode
    /** Rendered on the right of the title row — a legend, a range label, an action. */
    aside?: React.ReactNode
    className?: string
}

export function CardHeader({ title, aside, className }: CardHeaderProps) {
    return (
        <div className={cn("flex items-center justify-between gap-4", className)}>
            <h2 className="text-xl font-semibold">{title}</h2>
            {aside}
        </div>
    )
}
