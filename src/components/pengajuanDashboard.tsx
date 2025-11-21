'use client';

type StatusColor = "sky" | "emerald" | "red" | "amber";

const statusColorMap: Record<StatusColor, string> = {
    sky: 'bg-sky-100 text-sky-500',
    emerald: 'bg-emerald-100 text-emerald-500',
    red: 'bg-red-100 text-red-500',
    amber: 'bg-amber-100 text-amber-500',
};

function PengajuanStatus({
    status,
    color,
    className = ''
}: {
    status: string;
    color: StatusColor;
    className?: string;
}) {
    const colorClasses = statusColorMap[color] ?? 'bg-gray-100 text-gray-700';
    return (
        <span className={`inline-flex items-center justify-center px-3 py-1 rounded-full text-xs font-semibold ${colorClasses} ${className}`}>
            {status}
        </span>
    );
}

interface PengajuanItem {
    id: number;
    description: string;
    status: string;
    color: StatusColor;
}

export default function PengajuanDashboard() {

    const dataPengajuan: PengajuanItem[] = [
        {
            id: 1,
            description: "Perubahan Jadwal 6 Oktober 2025",
            status: "Disetujui",
            color: "emerald"
        },
        {
            id: 2,
            description: "Penambahan Jadwal 18 Oktober 2025",
            status: "Menunggu",
            color: "amber"
        },
        {
            id: 3,
            description: "Penambahan Jadwal 4 Oktober 2025",
            status: "Ditolak",
            color: "red"
        },
        {
            id: 4,
            description: "Perubahan Jadwal 6 Oktober 2025",
            status: "Disetujui",
            color: "emerald"
        },
        {
            id: 5,
            description: "Penambahan Jadwal 18 Oktober 2025",
            status: "Menunggu",
            color: "amber"
        },
        {
            id: 6,
            description: "Penambahan Jadwal 4 Oktober 2025",
            status: "Ditolak",
            color: "red"
        },
        {
            id: 7,
            description: "Perubahan Jadwal 6 Oktober 2025",
            status: "Disetujui",
            color: "emerald"
        },
        {
            id: 8,
            description: "Penambahan Jadwal 18 Oktober 2025",
            status: "Menunggu",
            color: "amber"
        },
        {
            id: 9,
            description: "Penambahan Jadwal 4 Oktober 2025",
            status: "Ditolak",
            color: "red"
        }
    ];

    return (
        <div className="bg-white rounded-xl w-full h-full p-4 border border-neutral-300 flex flex-col">
            {/* Header */}
            <div className="flex justify-between items-center mb-[24px]">
                <h1 className="text-xl font-semibold">Pengajuan</h1>
                <div className="flex flex-col items-center rounded-xl px-3 py-1">
                    <h2 className="text-neutral-500 text-xs font-semibold">7 Hari Terakhir</h2>
                </div>
            </div>

            {/* Dynamic List Rendering */}
            <div className="space-y-4 overflow-y-auto">
                {dataPengajuan.length > 0 ? (
                    dataPengajuan.map((item) => (
                        <div key={item.id} className="flex justify-between items-center">
                            <p className="text-xs font-medium text-gray-700">{item.description}</p>
                            <div>
                                <PengajuanStatus 
                                    className="h-full w-28 rounded-full text-xs font-semibold" 
                                    status={item.status} 
                                    color={item.color} 
                                />
                            </div>
                        </div>
                    ))
                ) : (
                    <p className="text-center text-xs text-gray-400 py-4">Tidak ada data pengajuan.</p>
                )}
            </div>
        </div>
    )
}