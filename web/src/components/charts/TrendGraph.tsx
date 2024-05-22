import React from 'react';
import {
    Area,
    AreaChart,
    CartesianGrid,
    ResponsiveContainer,
    Tooltip,
    XAxis,
    YAxis,
} from 'recharts';

import { SENTIMENT_TREND_DATA } from './testdata';

interface TrendGraphProps {
    data: any[];
    empty: boolean;
}

function CustomTooltip({ active, payload, label }: any) {
    if (active && payload && payload.length) {
        return (
            <div className="tooltip min-h-[80px] min-w-[200px] border-[1px] bg-white p-2">
                <h4 className="text-[#268b07] font-bold">{label}</h4>
                <p className="text-[#060e14]">Sentiment: {payload[0].value}</p>
                <p className="text-[#060e14]">{payload[0].payload.description}</p>
            </div>
        );
    }
    return null;
}

export default function TrendGraph({ data = SENTIMENT_TREND_DATA, empty }: TrendGraphProps) {
    if (empty) {
        return (
            <div className="max-h-[400px] min-h-[400px] min-w-[160px] max-w-[160px] items-center justify-center">
                <p className="mt-[50px] text-center text-[#c6bed4]">Sorry,</p>
                <p className="mt-[75px] text-center text-[#281c34]">There`s no data.</p>
            </div>
        );
    }

    return (
        <ResponsiveContainer width={575} height={400} className="ml-[-40px]">
            <AreaChart data={data}>
                <defs>
                    <linearGradient id="color" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="0%" stopColor="#268b07" stopOpacity={0.9} />
                        <stop offset="75%" stopColor="#10d48e" stopOpacity={0.6} />
                    </linearGradient>
                </defs>
                <Area dataKey="sentiment" fill="url(#color)" stroke="#281c34" />
                <XAxis dataKey="name" tick={{ fill: '#49565f' }} tickLine={false} />
                <YAxis
                    type="number"
                    domain={[0, 5]}
                    axisLine={false}
                    tickLine={false}
                    tick={{ fill: '#49565f' }}
                />
                <Tooltip content={<CustomTooltip />} />
                <CartesianGrid opacity={0.4} vertical={false} />
            </AreaChart>
        </ResponsiveContainer>
    );
}