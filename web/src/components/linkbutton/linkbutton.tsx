// LinkButton.tsx
/* eslint-disable @typescript-eslint/no-explicit-any */
import { get, onValue, ref, set } from 'firebase/database';
import React, { useRef, useState } from 'react';

import { database } from '../../../firebase/firebase';
import { Show } from '../../pages/Showlist';
import sentimentAnalyzer from '../../processes/SentimentAnalyzer.mjs';
import { useButtonPress } from './buttonpress';
interface LinkButtonProps {
	onDataReceived: (data: any) => void;
	children: React.ReactNode;
	selected: boolean;
	numReviews: number;
	onClickEvent: (show: Show) => void;
	show: Show;
}

export const Linkbutton = ({
	onDataReceived,
	children,
	selected,
	numReviews,
	onClickEvent,
	show,
}: LinkButtonProps) => {
	const buttonRef = useRef(null);
	const [isLoading, setIsLoading] = useState(false);
	const [error, setError] = useState<Error | null>(null);
	//const [sentiments, setSentiments] = useState<number[]>([]);

	const handleButtonClick = () => {
		setIsLoading(true);
		setError(null);
		onClickEvent(show);
		const reviewRef = ref(database, `reviews/`);
		const sentimentRef = ref(database, `sentiments/`);

		// const showReviews = getReviews(show.name);
		// this is running the new sentiment analysis any t
		onValue(
			reviewRef,
			async (snapshot) => {
				const data = snapshot.val(); // this is of all reviews
				const reviews = Object.values(data)
					.slice(0, numReviews)
					.map((review: any) => review.content);
				// we have the show, we want to see if there are already sentiments for the show
				let sentiments;
				try {
					const sentimentSnapshot = await get(sentimentRef);
					if (sentimentSnapshot.exists()) {
						sentiments = sentimentSnapshot.val();
					} else {
						sentiments = await sentimentAnalyzer.getSentiments(reviews);
						set(sentimentRef, sentiments);
					}
				} catch (e) {
					console.error(e);
				} finally {
					onDataReceived(sentiments);
					setIsLoading(false);
				}
			},
			(errorObject) => {
				setError(new Error('The read failed: ' + errorObject));
				setIsLoading(false);
			},
		);
	};

	useButtonPress(buttonRef, handleButtonClick);

	return (
		<div>
			<button
				ref={buttonRef}
				className={`w-full cursor-pointer rounded-lg px-4 py-2 text-left text-xl text-white ${
					selected ? 'bg-[#10d48e]' : 'bg-[#204a5e] hover:bg-[#2a6a83]'
				}`}
			>
				{isLoading ? 'Loading...' : children}
			</button>
			{error && <p>Error: {error.message}</p>}
		</div>
	);
};
