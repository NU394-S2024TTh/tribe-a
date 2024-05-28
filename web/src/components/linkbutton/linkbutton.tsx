// LinkButton.tsx
/* eslint-disable @typescript-eslint/no-explicit-any */
import { onValue, ref } from 'firebase/database';
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

	const handleButtonClick = () => {
		setIsLoading(true);
		setError(null);
		onClickEvent(show);
		const reviewsRef = ref(database, 'reviews');
		onValue(
			reviewsRef,
			async (snapshot) => {
				const data = snapshot.val();
				const reviews = Object.values(data)
					.slice(0, numReviews);
					//.map((review: any) => review.content);

				// Get sentiments for reviews
				console.log(reviews);
				const sentiments = await sentimentAnalyzer.getDatedSentiments(reviews);
				console.log(sentiments);

				onDataReceived(sentiments);
				setIsLoading(false);
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
