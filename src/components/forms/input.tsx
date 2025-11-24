type Props = {
    onChange: (e: React.ChangeEvent<HTMLInputElement>) => void,
    value: string | number,
    id: string,
    type?: string,
    error?: boolean,
    disabled?: boolean,
    min?: number,
    max?: number,
    maxLength?: number,
    placeholder?: string,
    accept?: string
}

export default function Input({ onChange, value, id, type, error, disabled = false, min, max, maxLength, placeholder = "", accept }: Props) {
    return (
        <input placeholder={placeholder} min={min} max={max} maxLength={maxLength} disabled={disabled} onChange={onChange} value={value} id={id} autoComplete="off" type={type ?? "text"} accept={accept} className={`${error ? 'border-red-200' : 'border-neutral-200'} ${disabled ? 'bg-neutral-100 opacity-60' : ''} file:border-solid file:border file:px-3 file:text-xs file:border-neutral-200 file:py-1 file:rounded-full block w-full px-2 py-2 mt-1 text-sm transition border focus:outline-none rounded-xl focus:border-sky-400 focus:ring-2 focus:ring-sky-200`} />
    )
}