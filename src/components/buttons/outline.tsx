import Link from "next/link"

import { InnerShadowTopRightSolid } from "@/components/icons/solid"
import { cn } from "@/lib/utils"

type OutlineButtonProps<T extends React.ElementType> = {
    as?: T
    children?: React.ReactNode

    className?: string

    isLoading?: boolean
    iconPosition?: "left" | "right"

    icon?: React.ReactNode
    centerText?: boolean

    buttonType?: "primary" | "secondary" | "danger"
} & React.ComponentPropsWithoutRef<T>

const toneClasses = {
    primary: "border-sky-500 text-sky-500 hover:bg-sky-50",
    secondary: "border-neutral-200 bg-neutral-50 text-neutral-700 hover:bg-neutral-100",
    danger: "border-red-500 text-red-500 hover:bg-red-50",
} as const

export default function OutlineButton<T extends React.ElementType = "button">({
    as,
    children,
    className,
    isLoading,
    iconPosition,
    icon,
    centerText,
    buttonType = "primary",
    ...rest
}: OutlineButtonProps<T>) {
    let Button: React.ElementType = as || "button"
    if (as === "link") Button = Link

    const base = cn(
        "justify-between inline-flex items-center gap-x-2 cursor-pointer border font-medium py-2 rounded-full transition text-sm",
        "scale-3d hover:active:scale-95",
        "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sky-200 focus-visible:ring-offset-2",
        "disabled:cursor-not-allowed disabled:opacity-60 disabled:hover:scale-100",
        toneClasses[buttonType],
        isLoading ? (iconPosition === "right" ? "pl-4 pr-2" : "pl-2 pr-4") : "px-4",
        iconPosition === "right" && "flex-row-reverse",
        centerText && "w-full"
    )

    return (
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
