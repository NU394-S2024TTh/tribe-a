/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */
import {
	Area,
	AreaChart,
	CartesianGrid,
	Label,
	ResponsiveContainer,
	Tooltip,
	XAxis,
	YAxis,
} from 'recharts';

interface AreaGraphProps {
	receivedData: any;
	empty: boolean;
}

function CustomTooltip({ active, payload, label }: any) {
	if (active) {
		return (
			<div className="tooltip  min-h-[69px] min-w-[160px] border-[1px] bg-white">
				<h4 className="ml-[6px] mt-[5px] text-[#c6bed4]">Ballls:</h4>
				<h4 className="ml-[6px] mt-[14px] text-[#281c34]">Not sure what`s going on</h4>
			</div>
		);
	}
	return null;
}

export default function AreaGraph({ receivedData, empty }: AreaGraphProps) {
	if (empty) {
		return (
			<ResponsiveContainer width={575} height={400} className="ml-[-40px]">
				<AreaChart data={receivedData}>
					<defs>
						<linearGradient id="color" x1="0" y1="0" x2="0" y2="1">
							<stop offset="0%" stopColor="#281c34" stopOpacity={0.9} />
							<stop offset="75%" stopColor="#483464" stopOpacity={0.2} />
						</linearGradient>
					</defs>
					<XAxis dataKey="name" tick={false} tickLine={false} />
					<YAxis
						type="number"
						domain={[0, 5]}
						axisLine={false}
						tickLine={false}
						tick={{ fill: '#49565f' }}
					/>
					<CartesianGrid opacity={0.4} vertical={false} />
				</AreaChart>
			</ResponsiveContainer>
		);
	}
	return (
		<ResponsiveContainer width={575} height={400} className="ml-[-40px]">
			<AreaChart data={receivedData}>
				<defs>
					<linearGradient id="color" x1="0" y1="0" x2="0" y2="1">
						<stop offset="0%" stopColor="#281c34" stopOpacity={0.9} />
						<stop offset="75%" stopColor="#483464" stopOpacity={0.2} />
					</linearGradient>
				</defs>
				<Area dataKey="number" fill="url(#color)" stroke="#281c34" />
				<XAxis dataKey="name" tick={{ fill: '#49565f' }} tickLine={false} />
				<YAxis
					type="number"
					domain={[0, 5]}
					axisLine={false}
					tickLine={false}
					tick={{ fill: '#49565f' }}
				/>
				{/* <Tooltip/> */}
				<Tooltip content={<CustomTooltip />} />
				<CartesianGrid opacity={0.4} vertical={false} />
			</AreaChart>
		</ResponsiveContainer>
	);
}
