'use client';
import { 
  RadialBarChart, 
  RadialBar, 
  ResponsiveContainer,
  PolarAngleAxis
} from 'recharts';

const data = [
    {
        name: 'present',
        count: 30,
        fill: '#00A6F4'
    }
];

const PieChart = () => {
    
    const attendancePercentage = data[0].count;

    return (
        <div className="bg-white rounded-xl w-full h-full p-4 border border-neutral-300 flex flex-col">
            {/* TITLE */}
            <div className='flex justify-between items-center'>
                <h1 className='text-2xl font-semibold'>Presentase Kehadiran</h1>
            </div>
            
            {/* Legend */}
            <div className='flex justify-start gap-4 mt-2 mb-4'>
                <div className='flex items-center gap-2'>
                    <div className="w-2 h-2 bg-sky-500 rounded-full"></div>
                    <h1 className='text-xs font-semibold text-sky-500'>Hadir</h1>
                </div>
                <div className='flex items-center gap-2'>
                    <div className="w-2 h-2 bg-neutral-300 rounded-full"></div>
                    <h1 className='text-xs font-semibold text-neutral-300'>Tidak Hadir</h1>
                </div>
            </div>
            
            {/* CHART */}
            <div className='relative w-full flex-1 min-h-[200px]'>
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
                        <PolarAngleAxis 
                            type="number" 
                            domain={[0, 100]}
                            angleAxisId={0} 
                            tick={false}
                        />
                        <RadialBar
                            background
                            dataKey="count"
                            cornerRadius={10}
                            angleAxisId={0}
                        />
                    </RadialBarChart>
                </ResponsiveContainer>
            </div>

            {/* Bottom */}
            <div className='flex flex-col items-center justify-center mt-4'>
                <h1 className='text-5xl font-bold text-sky-500'>{attendancePercentage}%</h1>
            </div>
        </div>
    );
};

export default PieChart;