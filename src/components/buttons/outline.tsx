import Link from "next/link"

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

    buttonType?: "primary" | "secondary" | "danger"
} & React.ComponentPropsWithoutRef<T>

export default function OutlineButton<T extends React.ElementType = "button">({ as, children, className, isLoading, iconPosition, icon, centerText, buttonType = "primary", ...rest }: PrimaryButtonProps<T>) {
    var Button = as || "button"
    if (as === "link") {
        // @ts-ignore
        Button = Link
    }

    const defaultClassName = `${isLoading ? (iconPosition === 'right' ? 'pl-4 pr-2' : 'pl-2 pr-4') : 'px-4'} ${iconPosition === 'right' ? 'flex-row-reverse' : ''} ${centerText ? 'w-full' : ''} ${buttonType === 'secondary' ? 'border-neutral-200 bg-neutral-50' : (buttonType === 'danger' ? 'border-red-500 text-red-500' : 'border-sky-500 text-sky-500')} justify-between inline-flex items-center gap-x-2 cursor-pointer border scale-3d hover:active:scale-95 font-medium py-2 rounded-full transition`

    return (
        <Button {...rest} className={cn(className, defaultClassName)}>
            {centerText ? (
                <>
                    <div>{isLoading ? <InnerShadowTopRightSolid className="animate-spin w-4 h-4" /> : (icon && <span>{icon}</span>)}</div>
                    <span>{children}</span>
                    <div></div>
                </>
            ) : (
                <>
                    {isLoading ? <span><InnerShadowTopRightSolid className="animate-spin w-4 h-4" /></span> : (icon && <span>{icon}</span>)} <span>{children}</span>
                </>
            )}
        </Button>
    )
}