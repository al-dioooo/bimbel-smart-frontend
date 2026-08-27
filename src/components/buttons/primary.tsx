import { InnerShadowTopRightSolid } from "@/components/icons/solid"
import { cn } from "@/lib/utils"

type PrimaryButtonProps<T extends React.ElementType> = {
    as?: T
    children?: React.ReactNode

    className?: string

    isLoading?: boolean
    iconPosition?: "left" | "right"

    icon?: React.ReactNode
    centerText?: boolean
} & React.ComponentPropsWithoutRef<T>

export default function PrimaryButton<T extends React.ElementType = "button">({
    as,
    children,
    className,
    isLoading,
    iconPosition,
    icon,
    centerText,
    ...rest
}: PrimaryButtonProps<T>) {
    const Button = as || "button"

    const base = cn(
        "justify-between inline-flex items-center gap-x-2 cursor-pointer font-medium py-2 rounded-full transition text-sm",
        "bg-radial-[at_0%_0%] from-sky-500 to-sky-300 text-white",
        "hover:from-sky-400 hover:to-sky-200 scale-3d hover:active:scale-95",
        "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sky-300 focus-visible:ring-offset-2",
        "disabled:cursor-not-allowed disabled:opacity-60 disabled:hover:scale-100",
        isLoading ? (iconPosition === "right" ? "pl-6 pr-4" : "pl-4 pr-6") : "px-6",
        iconPosition === "right" && "flex-row-reverse",
        centerText && "w-full"
    )

    return (
        // Caller classes come last so they can override the defaults.
        <Button {...rest} className={cn(base, className)}>
            {centerText ? (
                <>
                    <div>{isLoading ? <InnerShadowTopRightSolid className="animate-spin w-4 h-4" /> : (icon && <span>{icon}</span>)}</div>
                    <span>{children}</span>
                    <div />
                </>
            ) : (
                <>
                    {isLoading ? <span><InnerShadowTopRightSolid className="animate-spin w-4 h-4" /></span> : (icon && <span>{icon}</span>)}
                    <span>{children}</span>
                </>
            )}
        </Button>
    )
}
