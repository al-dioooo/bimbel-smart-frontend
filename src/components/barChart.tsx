'use client';
import { 
    BarChart, 
    Bar, 
    XAxis, 
    ResponsiveContainer,
    Cell
} from 'recharts';

const data = [
  {
    name: 'Hadir',
    count: 64,
    fill: '#0ea5e9', 
  },
  {
    name: 'Sakit',
    count: 6,
    fill: '#fa95a5', 
  },
  {
    name: 'Izin',
    count: 3,
    fill: '#f59e0b', 
  },
  {
    name: 'Alpha',
    count: 0,
    fill: '#f43f5e', 
  },
];

interface CustomTickProps {
  x?: number;
  y?: number;
  payload?: {
    value: string;
  };
}

const CustomXAxisTick = (props: CustomTickProps) => {

    const { x, y, payload } = props;
    
    if (payload && payload.value) {
        const item = data.find(d => d.name === payload.value);
        if (!item) return null;

        return (
            <g transform={`translate(${x},${y})`}>
                <text 
                    x={0} 
                    y={0} 
                    dy={20} 
                    textAnchor="middle" 
                    fill={item.fill} 
                    className="text-lg font-bold"
                    style={{ fontWeight: 700, fontSize: '16px' }}
                >
                    {item.count}
                </text>
            </g>
        );
    }
    return null;
};

const BarChartAbsensi = () => {
  return (
    <div className="bg-white rounded-xl w-full h-full p-4 border border-neutral-300 flex flex-col">
        <div className=''>
            <h1 className='text-2xl font-semibold'>Kehadiran</h1>
        </div>

        <div className='flex flex-wrap justify-start gap-4 mt-2 mb-4'>
            {data.map((item, index) => (
                <div key={index} className='flex items-center gap-2'>
                    <div className="w-2 h-2 rounded-full" style={{ backgroundColor: item.fill }}></div>
                    <h1 className='text-xs font-semibold' style={{ color: item.fill }}>{item.name}</h1>
                </div>
            ))}
        </div>

        <div className='relative w-full flex-1 min-h-[200px]'>
            <ResponsiveContainer width="100%" height="100%">
                <BarChart 
                    data={data} 
                    margin={{ top: 0, right: 0, left: 0, bottom: 10 }}
                >
                    <XAxis 
                        dataKey="name" 
                        axisLine={{ stroke: '#e5e5e5', strokeWidth: 1 }} 
                        tickLine={false} 
                        // TypeScript will now accept this component because the props match
                        tick={<CustomXAxisTick />} 
                        interval={0} 
                    />
                    <Bar 
                        dataKey="count" 
                        barSize={40} 
                    >
                        {
                            data.map((entry, index) => (
                                <Cell key={`cell-${index}`} fill={entry.fill} />
                            ))
                        }
                    </Bar>
                </BarChart>
            </ResponsiveContainer>
        </div>
    </div>
  );
};

export default BarChartAbsensi;