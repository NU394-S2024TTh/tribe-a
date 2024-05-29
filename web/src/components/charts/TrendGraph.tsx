import React from 'react';
import {
	CartesianGrid,
	Label,
	Legend,
	Line,
	LineChart,
	ResponsiveContainer,
	Tooltip,
	TooltipProps,
	XAxis,
	YAxis,
} from 'recharts';

interface Review {
	sentiment: number;
	created: string;
}

interface TrendAnalysisProps {
	data: Review[];
}

interface ProcessedData {
	[key: string]: {
		date: string;
		totalRating: number;
		count: number;
	};
}

interface CustomTooltipProps extends TooltipProps<number, string> {
	active?: boolean;
	payload?: {
		value: number;
	}[];
	label?: string;
}

function CustomTooltip({ active, payload, label }: CustomTooltipProps) {
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

export default function TrendAnalysis({ data }: TrendAnalysisProps) {
	if (!data || !Array.isArray(data)) {
		return <div>No data available</div>;
	}

	const processedData = data.reduce((acc: ProcessedData, review) => {
		const date = new Date(review.created);
		const month = date.getMonth() + 1; // getMonth() is zero-based, so we add 1
		const year = date.getFullYear();
		const key = `${year}-${month < 10 ? '0' : ''}${month}`; // Format as YYYY-MM

		if (!acc[key]) {
			acc[key] = {
				date: key,
				totalRating: 0,
				count: 0,
			};
		}

		acc[key].totalRating += review.sentiment;
		acc[key].count++;

		return acc;
	}, {} as ProcessedData);

	const monthlyData = Object.values(processedData).map((data) => ({
		date: data.date,
		averageRating: data.totalRating / data.count,
	}));

	// Sort monthlyData by date in ascending order
	monthlyData.sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());

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
				<YAxis
					domain={[0, 5]}
					axisLine={false}
					tickLine={false}
					tick={{ fill: '#49565f' }}
				>
					<Label value="Sentiment" angle={-90} position="left" offset={-10} />
				</YAxis>
				<Tooltip content={<CustomTooltip />} />
				<Line
					type="monotone"
					dataKey="averageRating"
					stroke="url(#color)"
					strokeWidth={3}
					activeDot={{ r: 8 }}
				/>
			</LineChart>
		</ResponsiveContainer>
	);
}
