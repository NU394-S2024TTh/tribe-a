/* eslint-disable @typescript-eslint/no-explicit-any */
import { Bar, BarChart, CartesianGrid, Tooltip, XAxis, YAxis } from 'recharts';

interface BarGraphProps {
	receivedData: any;
	empty: any;
}

function CustomTooltip({ active, payload, label }: any) {
	if (active) {
		return (
			<div className="tooltip  min-h-[69px] min-w-[160px] border-[1px] bg-white">
				<h4 className="ml-[6px] mt-[5px] text-[#268b07]">{label}:</h4>
				<h4 className="mb-[5px] ml-[6px] mr-[5px] mt-[15px] text-[#060e14]">
					For {label}, reviews average {payload[0].value} out of 5.
				</h4>
			</div>
		);
	}
	return null;
}

// const gradient = (
// 	<defs>
// 		<linearGradient id="color" x1="0" y1="0" x2="0" y2="1">
// 			<stop offset="0%" stopColor="#268b07" stopOpacity={0.9} />
// 			<stop offset="75%" stopColor="#10d48e" stopOpacity={0.2} />
// 		</linearGradient>
// 	</defs>
// );

export default function BarGraph({ receivedData, empty }: BarGraphProps) {
	if (empty) {
		return (
			<BarChart
				width={600}
				height={400}
				data={receivedData}
				margin={{
					top: 5,
					right: 40,
					left: 0,
					bottom: 5,
				}}
				className="ml-[-35px] mr-[-30px]"
			>
				<XAxis dataKey="name" axisLine={true} tick={false} />
				<YAxis type="number" domain={[0, 5]} axisLine={false} tickLine={false} />
				<CartesianGrid opacity={0.4} vertical={false} />
			</BarChart>
		);
	}
	if (receivedData == null) {
		return (
			<div className="max-h-[400px] min-h-[400px] min-w-[160px] max-w-[160px] items-center justify-center">
				<p className="mt-[50px] text-center text-[#c6bed4]">Sorry,</p>
				<p className="mt-[75px] text-center text-[#281c34]">There`s no data.</p>
			</div>
		);
	} else {
		return (
			<BarChart
				width={600}
				height={400}
				data={receivedData}
				margin={{
					top: 5,
					right: 40,
					left: 0,
					bottom: 5,
				}}
				className="ml-[-35px] mr-[-30px]"
			>
				<defs>
					<linearGradient id="color" x1="0" y1="0" x2="0" y2="1">
						<stop offset="0%" stopColor="#268b07" stopOpacity={0.9} />
						<stop offset="60%" stopColor="#10d48e" stopOpacity={0.6} />
					</linearGradient>
				</defs>
				<XAxis dataKey="name" axisLine={true} />
				<YAxis type="number" domain={[0, 5]} axisLine={false} tickLine={false} />
				<CartesianGrid opacity={0.4} vertical={false} />
				<Tooltip content={<CustomTooltip />} />
				<Bar dataKey="number" fill="url(#color)" barSize="10%"></Bar>
			</BarChart>
		);
	}
}
