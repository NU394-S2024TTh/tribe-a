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
				<h4 className="ml-[6px] mt-[5px] text-[#268b07]">{label}</h4>
				<h4 className="ml-[6px] mr-[6px] mt-[14px] text-[#060e14]">
					{payload[0].value} reviews
				</h4>
			</div>
		);
	}
	return null;
}

export default function AreaGraph({ receivedData, empty }: AreaGraphProps) {
	if (empty) {
		return (
			<div className="max-h-[400px] min-h-[400px] min-w-[160px] max-w-[160px] items-center justify-center">
				<p className="mt-[50px] text-center text-[#268b07]">Sorry,</p>
				<p className="mt-[75px] text-center text-[#281c34]">There&apos;s no data.</p>
			</div>
		);
	}

	return (
		<ResponsiveContainer width={575} height={400} className="ml-[-40px]">
			<AreaChart data={receivedData}>
				<defs>
					<linearGradient id="color" x1="0" y1="0" x2="0" y2="1">
						<stop offset="0%" stopColor="#268b07" stopOpacity={0.9} />
						<stop offset="75%" stopColor="#10d48e" stopOpacity={0.6} />
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

				<Tooltip content={<CustomTooltip active={empty} />} />
				<CartesianGrid opacity={0.4} vertical={false} />
			</AreaChart>
		</ResponsiveContainer>
	);
}
