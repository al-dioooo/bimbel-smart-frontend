type Props = {
    htmlFor?: string
    value: string
}

export default function Label({ htmlFor, value }: Props) {
    return (
        <label htmlFor={htmlFor} className="block text-xs font-medium text-neutral-700">{value}</label>
    )
}
