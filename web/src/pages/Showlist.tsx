/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */
import '../themes/index.css';

import React, { useState } from 'react';
import { json } from 'react-router-dom';

import logo from '../../public/logo.png';
import { TEST_DATA } from '../components/charts/testdata';
import { Linkbutton } from '../components/linkbutton/linkbutton';
import SearchBar from '../components/search/searchbar';
import { getShowList } from '../firebase/firebasefunctions';
import SentimentAnalysis from './SentimentAnalysis';
export interface Show {
	name: string;
}

const shows: Show[] = [
	{ name: 'Avatar: The Last Airbender' },
	{ name: 'Elsbeth' },
	{ name: 'Frasier 2023' },
	{ name: 'Lawmen: Bass Reeves' },
	{ name: 'Special Ops: Lioness' },
	{ name: 'Star Trek: Lower Decks' },
	{ name: 'Star Trek: Picard' },
	{ name: 'The Offer' },
	{ name: 'Yellowjackets' },
];

export default function ShowList() {
	const [selectedShow, setSelectedShow] = useState<Show | null>(null);

	const handleShowClick = (show: Show): void => {
		setSelectedShow(show);
	};

	const [reviewData, setReviewData] = useState<any>(null);
	return (
		<div className="flex min-h-screen">
			<div className="mt-[-5vh] flex w-1/3 flex-col p-16">
				<div className="mb-8 flex w-fit flex-col">
					<div className="flex w-fit flex-row items-center justify-center">
						<img
							src={logo}
							alt="Streamlytics"
							className="mr-[0.6vw] mt-[0.3vh] h-9 w-9"
						></img>
						<div className="font-[ubuntu] text-4xl font-bold text-white">
							Streamlytics
						</div>
					</div>
					<div
						className="w-fill mb-[0.5vh] mt-[0.4vh] min-h-[0.6vh] rounded-md bg-[#10d48e] transition-all duration-700"
						id="underline"
					></div>
				</div>
				<div className="mb-[4vh]">
					<SearchBar onSearch={setReviewData} setName={setSelectedShow} />
				</div>
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
			<div className="w-2/3 p-8 pl-[10vw]">
				<div className="flex flex-col items-center justify-center">
					<div className="flex items-center justify-center">
						{selectedShow ? (
							<div>
								<SentimentAnalysis showName={selectedShow.name} data={reviewData} />
							</div>
						) : (
							<div className="flex h-full items-center justify-center font-[ubuntu] text-white">
								<p>Select a show to view its sentiment analysis.</p>
							</div>
						)}
					</div>
				</div>
			</div>
		</div>
	);
}
