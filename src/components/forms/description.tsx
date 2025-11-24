type Props = {
    value?: string
    error?: string[]
}

export default function Description({ value, error }: Props) {
    return (
        <>
            {error ? error.map((row, index) => (
                <div key={index}>
                    <span className="text-xs leading-none text-red-500">{row}</span>
                    <br />
                </div>
            )) : (<span className="text-xs leading-none text-neutral-500">{value}</span>)}
        </>
    )
}