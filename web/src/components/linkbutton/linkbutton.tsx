// LinkButton.tsx
/* eslint-disable @typescript-eslint/no-explicit-any */
import '../../themes/index.css';

import React, { useRef, useState } from 'react';

import { getReviews, Review } from '../../firebase/firebasefunctions';
import { ShowName } from '../../firebase/firebasefunctions';
import { useButtonPress } from './buttonpress';
interface LinkButtonProps {
	onDataReceived: (data: any) => void;
	children: React.ReactNode;
	selected: boolean;
	numReviews: number;
	onClickEvent: (show: ShowName) => void;
	show: ShowName;
}

export const Linkbutton = ({
	onDataReceived,
	children,
	selected,
	onClickEvent,
	show,
}: LinkButtonProps) => {
	const buttonRef = useRef(null);
	const [isLoading, setIsLoading] = useState(false);
	const [error, setError] = useState<Error | null>(null);

	function formatShowName(showName: string) {
		// Remove the season information (e.g., "(Season 3)")
		const nameWithoutSeason = showName.replace(/\s*\(Season \d+\)\s*$/i, '');

		// Remove colons, replace spaces with underscores, and convert to lowercase
		return nameWithoutSeason.replace(/:/g, '').replace(/\s+/g, '_').toLowerCase();
	}
	const handleButtonClick = async () => {
		setIsLoading(true);
		setError(null);
		onClickEvent(show);

		try {
			console.log(formatShowName(show.name));
			const reviews: Review[] = await getReviews(formatShowName(show.name));
			console.log(reviews);
			const reviewsData = reviews
				.filter(
					(review: any) =>
						review.rating !== undefined && review.rating !== null && review.rating !== '',
				)
				.map((review: any) => ({
					sentiment: review.rating,
					created: review.created,
				}));
			onDataReceived(reviewsData);
		} catch (error: any) {
			console.error('Failed to load reviews:', error);
			setError(new Error('Failed to load reviews: ' + error.message));
		} finally {
			setIsLoading(false);
		}
	};

	useButtonPress(buttonRef, handleButtonClick);

	return (
		<div>
			<button
				ref={buttonRef}
				className={`min-w-[25vw] cursor-pointer rounded-lg px-4 py-2 text-left font-[rubik] text-[2vh] text-white ${
					selected ? 'bg-[#10d48e]' : 'bg-[#204a5e] hover:bg-[#2a6a83]'
				}`}
			>
				{isLoading ? 'Loading...' : children}
			</button>
			{error && <p>Error: {error.message}</p>}
		</div>
	);
};
