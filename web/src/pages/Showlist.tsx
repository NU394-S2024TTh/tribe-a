/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useState } from 'react';
import { json } from 'react-router-dom';

import { TEST_DATA } from '../components/charts/testdata';
import { Linkbutton } from '../components/linkbutton/linkbutton';
import SentimentAnalysis from './SentimentAnalysis';

export interface Show {
	name: string;
}

const shows: Show[] = [
	{ name: 'Avatar: The Last Airbender' },
	{ name: 'Shogun' },
	{ name: 'Criminal Minds' },
	{ name: 'Big Brother' },
	{ name: 'Halo' },
];

export default function ShowList({ streamingservice }: { streamingservice: string }) {
	const [selectedShow, setSelectedShow] = useState<Show | null>(null);

	const handleShowClick = (show: Show): void => {
		setSelectedShow(show);
	};

	const [reviewData, setReviewData] = useState<any>(null);
	return (
		<div className="flex min-h-screen bg-[#132a3a]">
			<div className="w-1/3 p-8">
				<h1 className="mb-8 text-3xl font-bold text-white">{streamingservice}</h1>
				<ul className="space-y-4">
					{shows.map((show) => (
						<li key={show.name} className="rounded-lg">
							<Linkbutton
								selected={selectedShow?.name === show.name}
								onDataReceived={setReviewData}
								numReviews={10}
								onClickEvent={handleShowClick}
								show={show}
							>
								{show.name}
							</Linkbutton>
						</li>
					))}
				</ul>
			</div>
			<div className="w-2/3 p-8">
				{selectedShow ? (
					<div>
						<SentimentAnalysis showName={selectedShow.name} data={reviewData} />
					</div>
				) : (
					<div className="flex h-full items-center justify-center text-white">
						<p>Select a show to view its sentiment analysis.</p>
					</div>
				)}
			</div>
		</div>
	);
}
