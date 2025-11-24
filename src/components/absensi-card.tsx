'use client'

type AbsensiType = "hadir" | "sakit" | "izin" | "alpa";

const absensiColorMap: Record<AbsensiType, string> = {
    hadir: 'border-sky-400 text-sky-500',
    sakit: 'border-rose-300 text-rose-300',
    izin: 'border-amber-400 text-amber-500',
    alpa: 'border-rose-500 text-rose-500', 
};

// Pill Card
interface AbsensiPillProps {
    type: AbsensiType;
    count: number;
    label: string;
}

function AbsensiPill({ type, count, label }: AbsensiPillProps) {
    const colorClass = absensiColorMap[type];

    return (
        <div className={`flex items-center justify-center border-2 rounded-full px-6 py-2.5 min-w-[120px] bg-white ${colorClass}`}>
            <span className="font-bold text-sm">
                {count} {label}
            </span>
        </div>
    );
}

// Main Component
export default function AbsensiCard() {

    const dataAbsensi: AbsensiPillProps[] = [
        { type: 'hadir', count: 88, label: 'Hadir' },
        { type: 'sakit', count: 18, label: 'Sakit' },
        { type: 'izin', count: 8, label: 'Izin' },
        { type: 'alpa', count: 4, label: 'Alpa' },
    ];

    return (
        <div className="flex flex-wrap gap-4 w-full">
            {dataAbsensi.map((item, index) => (
                <AbsensiPill 
                    key={index}
                    type={item.type}
                    count={item.count}
                    label={item.label}
                />
            ))}
        </div>
    )
}