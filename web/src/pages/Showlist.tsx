/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useState } from 'react';

import { TEST_DATA } from '../components/charts/testdata';
import { Linkbutton } from '../components/linkbutton';
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
	{ name: 'Avatar: The Last Airbender', data: TEST_DATA },
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
	const [showReviews, setShowReviews] = useState<any>(null);
	return (
		<div className="flex min-h-screen bg-[#132a3a]">
			<div className="w-1/3 p-8">
				<h1 className="mb-8 text-3xl font-bold text-white">{streamingservice}</h1>
				<ul className="space-y-4">
					{shows.map((show) => (
						<li key={show.name} className="rounded-lg">
							<Linkbutton
								selected={selectedShow?.name === show.name}
								onDataReceived={setShowReviews}
							>
								{show.name}
							</Linkbutton>
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
