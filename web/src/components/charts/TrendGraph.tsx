import React from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, Label } from 'recharts';

interface TrendAnalysisProps {
  jsonData: any;
  showName: string | null;
}

interface ProcessedData {
  [key: string]: {
    date: string;
    totalRating: number;
    count: number;
  };
}

function CustomTooltip({ active, payload, label }: any) {
  if (active && payload && payload.length) {
    return (
      <div className="tooltip min-h-[69px] min-w-[160px] border-[1px] bg-white">
        <h4 className="ml-[6px] mt-[5px] text-[#268b07]">{label}</h4>
        <h4 className="ml-[6px] mr-[6px] mt-[14px] text-[#060e14]">
          {payload[0].value.toFixed(2)} average rating
        </h4>
      </div>
    );
  }
  return null;
}

export default function TrendAnalysis({ jsonData, showName }: TrendAnalysisProps) {
  const processedData = Object.values(jsonData.reviews)
    .filter((review: any) => review.show === showName)
    .reduce((acc: ProcessedData, review: any) => {
      const date = new Date(review.created);
      const month = date.getMonth();
      const year = date.getFullYear();
      const key = `${year}-${month}`;

      if (!acc[key]) {
        acc[key] = {
          date: `${year}-${month}`,
          totalRating: 0,
          count: 0,
        };
      }

      acc[key].totalRating += review.rating;
      acc[key].count++;

      return acc;
    }, {} as ProcessedData);

  const monthlyData = Object.values(processedData).map((data) => ({
    date: data.date,
    averageRating: data.totalRating / data.count,
  }));

  return (
    <ResponsiveContainer width={575} height={400} className="ml-[-40px]">
      <LineChart data={monthlyData} margin={{ top: 20, right: 30, left: 20, bottom: 20 }}>
        <defs>
          <linearGradient id="color" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#268b07" stopOpacity={0.9} />
            <stop offset="75%" stopColor="#10d48e" stopOpacity={0.6} />
          </linearGradient>
        </defs>
        <CartesianGrid opacity={0.4} vertical={false} />
        <XAxis dataKey="date" tick={{ fill: '#49565f' }} tickLine={false}>
          <Label value="Date" position="bottom" offset={0} />
        </XAxis>
        <YAxis domain={[0, 5]} axisLine={false} tickLine={false} tick={{ fill: '#49565f' }}>
          <Label value="Sentiment" angle={-90} position="left" offset={-10} />
        </YAxis>
        <Tooltip content={<CustomTooltip />} />
        <Legend />
        <Line type="monotone" dataKey="averageRating" stroke="url(#color)" strokeWidth={3} activeDot={{ r: 8 }} />
      </LineChart>
    </ResponsiveContainer>
  );
}