type Props = {
    error?: string[]
}

export default function ErrorMessage({ error }: Props) {
    if (!error?.length) return null

    return (
        <ul className="space-y-0.5">
            {error.map((row, index) => (
                <li key={index} className="text-xs leading-relaxed text-red-500">{row}</li>
            ))}
        </ul>
    )
}
