import { cn } from "@/lib/utils"

type Props = {
    onChange: (e: React.ChangeEvent<HTMLInputElement>) => void
    value: string | number
    id: string
    type?: string
    /** Accepts a Laravel error array directly, or a plain boolean. */
    error?: boolean | string[]
    disabled?: boolean
    min?: number
    max?: number
    maxLength?: number
    placeholder?: string
    accept?: string
}

export default function Input({
    onChange,
    value,
    id,
    type,
    error,
    disabled = false,
    min,
    max,
    maxLength,
    placeholder = "",
    accept,
}: Props) {
    const hasError = Array.isArray(error) ? error.length > 0 : !!error

    return (
        <input
            id={id}
            type={type ?? "text"}
            value={value}
            onChange={onChange}
            placeholder={placeholder}
            min={min}
            max={max}
            maxLength={maxLength}
            disabled={disabled}
            accept={accept}
            autoComplete="off"
            aria-invalid={hasError || undefined}
            className={cn(
                "block w-full px-3 py-2 mt-1 text-sm transition border rounded-xl",
                "focus:outline-none focus:ring-2",
                hasError
                    ? "border-red-300 focus:border-red-400 focus:ring-red-200"
                    : "border-neutral-200 focus:border-sky-400 focus:ring-sky-200",
                disabled && "bg-neutral-100 opacity-60 cursor-not-allowed",
                "file:border-solid file:border file:px-3 file:text-xs file:border-neutral-200 file:py-1 file:rounded-full"
            )}
        />
    )
}
