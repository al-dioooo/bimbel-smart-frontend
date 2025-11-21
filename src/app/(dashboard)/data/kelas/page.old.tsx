import ListKelasDataClient from "@/app/data/kelas/data-client"
import { apiServerGet } from "@/helpers/api-server"

type PageProps = {
    searchParams: Promise<{ [key: string]: string | string[] | undefined }>
}

export default async function ListKelasPage({ searchParams }: PageProps) {
    // SSR Fetch
    const initialData = await apiServerGet("/kelas", { ...(await searchParams) })

    return (
        <div className="space-y-6">
            {/* Title */}
            <h1 className="text-3xl font-semibold">List Kelas</h1>

            <div>
                <ListKelasDataClient initialData={initialData} />
            </div>
        </div>
    )
}

export const runtime = "nodejs"