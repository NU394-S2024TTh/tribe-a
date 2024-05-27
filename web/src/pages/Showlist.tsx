import React, { useState } from 'react';

import { TEST_DATA } from '../components/charts/testdata';
import SentimentAnalysis from './SentimentAnalysis';

interface DataPoint {
	name: string;
	number: number;
}

interface Show {
	name: string;
	data: DataPoint[];
}

const shows: Show[] = [
	{ name: 'Yellowjackets', data: TEST_DATA },
	{ name: 'Shogun', data: TEST_DATA },
	{ name: 'Criminal Minds', data: TEST_DATA },
	{ name: 'Big Brother', data: TEST_DATA },
	{ name: 'Halo', data: TEST_DATA },
];

export default function ShowList({ streamingservice }: { streamingservice: string }) {
	const [selectedShow, setSelectedShow] = useState<Show | null>(null);

	const handleShowClick = (show: Show) => {
		setSelectedShow(show);
	};

	return (
		<div className="flex min-h-screen bg-[#132a3a]">
			<div className="w-1/3 p-8">
				<h1 className="mb-8 text-3xl font-bold text-white">{streamingservice}</h1>
				<ul className="space-y-4">
					{shows.map((show) => (
						<li key={show.name} className="rounded-lg">
							<button
								className={`w-full cursor-pointer rounded-lg px-4 py-2 text-left text-xl text-white ${
									selectedShow?.name === show.name
										? 'bg-[#10d48e]'
										: 'bg-[#204a5e] hover:bg-[#2a6a83]'
								}`}
								onClick={() => handleShowClick(show)}
							>
								{show.name}
							</button>
						</li>
					))}
				</ul>
			</div>
			<div className="w-2/3 p-8">
				{selectedShow ? (
					<SentimentAnalysis showName={selectedShow.name} data={selectedShow.data} />
				) : (
					<div className="flex items-center justify-center text-white">
						<p>Select a show to view its sentiment analysis.</p>
					</div>
				)}
			</div>
		</div>
	);
}
