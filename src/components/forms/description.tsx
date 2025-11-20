type Props = {
    value?: string
    error?: string[]
}

export default function Description({ value, error }: Props) {
    return (
        <>
            {error ? error.map((row, index) => (
                <>
                    <span className="text-xs leading-none text-red-500">{row}</span>
                    <br />
                </>
            )) : (<span className="text-xs leading-none text-neutral-500">{value}</span>)}
        </>
    )
}