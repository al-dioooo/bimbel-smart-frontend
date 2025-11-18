import ListKelasDataClient from "@/app/data/kelas/data-client"

export default async function ListKelasPage() {
    // SSR Fetch
    const initialData = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/kelas`, {
        cache: "no-store",
        headers: {
            "Content-Type": "application/json",
            Accept: "application/json",
        },
    }).then((res) => res.json())

    return (
        <ListKelasDataClient />
    )
}