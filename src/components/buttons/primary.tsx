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

export default function PrimaryButton<T extends React.ElementType = "button">({ as, children, className, isLoading, iconPosition, icon, centerText, ...rest }: PrimaryButtonProps<T>) {
    const Button = as || "button"

    const defaultClassName = `${isLoading ? (iconPosition === 'right' ? 'pl-6 pr-4' : 'pl-4 pr-6') : 'px-6'} ${iconPosition === 'right' ? 'flex-row-reverse' : ''} ${centerText ? 'w-full' : ''} justify-between inline-flex items-center gap-x-2 cursor-pointer bg-linear-to-tr from-blue-500 to-blue-300 hover:from-blue-400 hover:to-blue-200 scale-3d hover:active:scale-95 text-white font-medium py-2 rounded-full transition`

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