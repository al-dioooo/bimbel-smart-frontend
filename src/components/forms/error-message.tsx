type Props = {
    error: string[]
}

export default function ErrorMessage({ error }: Props) {
    return (
        <>
            {error && error.map((row) => (
                <>
                    <span className="text-xs leading-none text-red-500">{row}</span>
                    <br />
                </>
            ))}
        </>
    )
}