/* eslint-disable @typescript-eslint/no-explicit-any */
import { Bar, BarChart, Legend, Tooltip, XAxis, YAxis } from 'recharts';

interface BarGraphProps {
	receivedData: any;
}

export default function BarGraph({ receivedData }: BarGraphProps) {
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
		>
			<XAxis dataKey="name" />
			<YAxis type="number" domain={[0, 100]}></YAxis>
			<Tooltip />
			<Legend />
			<Bar dataKey="Rating" fill="#8884d8" />
		</BarChart>
	);
}
