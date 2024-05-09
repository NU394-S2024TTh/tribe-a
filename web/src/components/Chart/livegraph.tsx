/* eslint-disable @typescript-eslint/no-explicit-any */
import { Bar, BarChart, Tooltip, XAxis, YAxis } from 'recharts';

interface BarGraphProps {
	receivedData: any;
	empty: any;
}

function CustomTooltip({ active, payload, label }: any) {
	if (active) {
		return (
			<div className="tooltip  min-h-[69px] min-w-[160px] border-[1px] bg-white">
				<h4 className="ml-[6px] mt-[5px] text-[#c6bed4]">{label}:</h4>
				<h4 className="mb-[5px] ml-[6px] mr-[5px] mt-[15px] text-[#281c34]">
					For {label}, reviews say it is {payload} out of whatever.
				</h4>
			</div>
		);
	}
	return null;
}

export default function LiveBarGraph({ receivedData, empty }: BarGraphProps) {
	if (empty) {
		return (
			<BarChart
				width={200}
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
				<YAxis type="number" domain={[0, 100]} axisLine={false} tickLine={false} />
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
				width={200}
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
				<YAxis type="number" domain={[0, 100]} axisLine={false} tickLine={false} />
				<Tooltip content={<CustomTooltip />} />
				<Bar dataKey="Rating" fill="#483464" />
			</BarChart>
		);
	}
}
