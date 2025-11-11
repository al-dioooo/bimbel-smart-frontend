import Image from "next/image"
import LogoImage from "../../public/logo.png"

type Props = {
    className?: string
}

export default function Logo({ className }: Props) {
    return (
        <Image className={className} src={LogoImage} alt="Bimbel Smart Logo" />
    )
}