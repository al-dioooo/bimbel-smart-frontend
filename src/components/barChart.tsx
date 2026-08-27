'use client'

import { BarChart, Bar, XAxis, ResponsiveContainer, Cell } from 'recharts'

import { Card, CardHeader } from '@/components/ui/card'
import { attendance, toneHex, type AttendanceCode } from '@/lib/status'

type Props = {
    /** Counts keyed by attendance code. */
    values?: Partial<Record<AttendanceCode, number>>
    isLoading?: boolean
    error?: unknown
}

type Datum = { name: string; count: number; fill: string }

type CustomTickProps = {
    x?: number
    y?: number
    payload?: { value: string }
    data: Datum[]
}

/** Renders the count under each bar, in that bar's colour. */
const CustomXAxisTick = ({ x, y, payload, data }: CustomTickProps) => {
    if (!payload?.value) return null
    const item = data.find((d) => d.name === payload.value)
    if (!item) return null

    return (
        <g transform={`translate(${x},${y})`}>
            <text x={0} y={0} dy={20} textAnchor="middle" fill={item.fill} style={{ fontWeight: 700, fontSize: '16px' }}>
                {item.count}
            </text>
        </g>
    )
}

export default function BarChartAbsensi({ values, isLoading, error }: Props) {
    // Colours come from the shared status ramp; this component used to carry
    // its own set of raw hex values unrelated to the rest of the app.
    const data: Datum[] = (['h', 's', 'i', 'a'] as AttendanceCode[]).map((code) => ({
        name: attendance[code].label,
        count: values?.[code] ?? 0,
        fill: toneHex[attendance[code].tone],
    }))

    const isEmpty = data.every((d) => d.count === 0)

    return (
        <Card className="w-full h-full flex flex-col">
            <CardHeader title="Kehadiran" />

            <div className="flex flex-wrap justify-start gap-4 mt-2 mb-4">
                {data.map((item) => (
                    <div key={item.name} className="flex items-center gap-2">
                        <span className="w-2 h-2 rounded-full" style={{ backgroundColor: item.fill }} />
                        <span className="text-xs font-semibold" style={{ color: item.fill }}>{item.name}</span>
                    </div>
                ))}
            </div>

            {error ? (
                <div className="flex-1 min-h-[200px] grid place-items-center text-xs text-red-500">
                    Gagal memuat data kehadiran
                </div>
            ) : isLoading ? (
                <div className="flex-1 min-h-[200px] flex items-end justify-around gap-4 pb-6">
                    {[60, 30, 20, 12].map((h, i) => (
                        <div key={i} className="w-10 rounded-t bg-neutral-100 animate-pulse" style={{ height: `${h}%` }} />
                    ))}
                </div>
            ) : isEmpty ? (
                <div className="flex-1 min-h-[200px] grid place-items-center text-xs text-neutral-400">
                    Belum ada absensi pada periode ini
                </div>
            ) : (
                <div className="relative w-full flex-1 min-h-[200px]">
                    <ResponsiveContainer width="100%" height="100%">
                        <BarChart data={data} margin={{ top: 0, right: 0, left: 0, bottom: 10 }}>
                            <XAxis
                                dataKey="name"
                                axisLine={{ stroke: '#e5e5e5', strokeWidth: 1 }}
                                tickLine={false}
                                tick={<CustomXAxisTick data={data} />}
                                interval={0}
                            />
                            <Bar dataKey="count" barSize={40} radius={[6, 6, 0, 0]}>
                                {data.map((entry) => (
                                    <Cell key={entry.name} fill={entry.fill} />
                                ))}
                            </Bar>
                        </BarChart>
                    </ResponsiveContainer>
                </div>
            )}
        </Card>
    )
}
