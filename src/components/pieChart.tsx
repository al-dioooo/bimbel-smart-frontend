'use client'

import { RadialBarChart, RadialBar, ResponsiveContainer, PolarAngleAxis } from 'recharts'

import { Card, CardHeader } from '@/components/ui/card'
import { toneHex } from '@/lib/status'

type Props = {
    /** 0–100. */
    percentage?: number
    hadir?: number
    total?: number
    isLoading?: boolean
    error?: unknown
}

export default function PieChart({ percentage = 0, hadir = 0, total = 0, isLoading, error }: Props) {
    const data = [{ name: 'hadir', count: percentage, fill: toneHex.info }]

    return (
        <Card className="w-full h-full flex flex-col">
            <CardHeader title="Persentase Kehadiran" />

            <div className="flex justify-start gap-4 mt-2 mb-4">
                <div className="flex items-center gap-2">
                    <span className="w-2 h-2 bg-sky-500 rounded-full" />
                    <span className="text-xs font-semibold text-sky-500">Hadir</span>
                </div>
                <div className="flex items-center gap-2">
                    <span className="w-2 h-2 bg-neutral-300 rounded-full" />
                    <span className="text-xs font-semibold text-neutral-400">Tidak Hadir</span>
                </div>
            </div>

            {error ? (
                <div className="flex-1 min-h-[200px] grid place-items-center text-xs text-red-500">
                    Gagal memuat data kehadiran
                </div>
            ) : isLoading ? (
                <div className="flex-1 min-h-[200px] grid place-items-center">
                    <div className="w-40 h-40 rounded-full border-8 border-neutral-100 animate-pulse" />
                </div>
            ) : total === 0 ? (
                <div className="flex-1 min-h-[200px] grid place-items-center text-xs text-neutral-400">
                    Belum ada absensi pada periode ini
                </div>
            ) : (
                <>
                    <div className="relative w-full flex-1 min-h-[200px]">
                        <ResponsiveContainer width="100%" height="100%">
                            <RadialBarChart
                                cx="50%"
                                cy="50%"
                                innerRadius="75%"
                                outerRadius="100%"
                                barSize={100}
                                data={data}
                                startAngle={90}
                                endAngle={-270}
                            >
                                <PolarAngleAxis type="number" domain={[0, 100]} angleAxisId={0} tick={false} />
                                <RadialBar background dataKey="count" cornerRadius={10} angleAxisId={0} />
                            </RadialBarChart>
                        </ResponsiveContainer>
                    </div>

                    <div className="flex flex-col items-center justify-center mt-4">
                        <p className="text-5xl font-bold text-sky-500">{percentage}%</p>
                        <p className="mt-1 text-xs text-neutral-500">
                            {hadir} hadir dari {total} absensi
                        </p>
                    </div>
                </>
            )}
        </Card>
    )
}
