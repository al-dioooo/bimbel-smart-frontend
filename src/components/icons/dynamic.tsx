type Props = {
    className?: string
    strokeWidth?: number
    direction: "up" | "down" | false
}

export const ChevronUpDown = ({ className = "", strokeWidth = 1.5, direction }: Props) => {
    return (
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={strokeWidth} stroke="currentColor" className={className}>
            <path d="M8 9L12 5L16 9" opacity={direction === "up" ? 1 : .5} stroke-linecap="round" stroke-linejoin="round" />
            <path d="M16 15L12 19L8 15" opacity={direction === "down" ? 1 : .5} stroke-linecap="round" stroke-linejoin="round" />
        </svg>
    )
}