type Props = {
    value?: string
    error?: string[]
}

export default function Description({ value, error }: Props) {
    if (error?.length) {
        return (
            <ul className="mt-1 space-y-0.5">
                {error.map((row, index) => (
                    <li key={index} className="text-xs leading-relaxed text-red-500">{row}</li>
                ))}
            </ul>
        )
    }

    if (!value) return null

    return <span className="mt-1 block text-xs leading-relaxed text-neutral-500">{value}</span>
}
