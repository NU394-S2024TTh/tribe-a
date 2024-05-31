/* eslint-disable jsx-a11y/no-static-element-interactions */
import { useEffect, useState } from 'react';

import { getReviewsWithPerplexity } from '../../processes/perplexity.mjs';

export type RecentReview = {
	title: string;
	content: string;
	source: string;
	date_posted: string;
	rating?: number;
};

const RecentReviewsList = ({ showName }: { showName: string | null }) => {
	const [reviews, setReviews] = useState<RecentReview[]>([]);
	const [isLoading, setIsLoading] = useState(false);
	const [currentReviewIndex, setCurrentReviewIndex] = useState<number>(0);
	const [isExpanded, setIsExpanded] = useState<boolean>(false);

	useEffect(() => {
		const fetchReviews = async () => {
			setIsLoading(true);
			const reviews = await getReviewsWithPerplexity(showName);
			setReviews(reviews);
			setIsLoading(false);
		};
		if (showName) {
			fetchReviews();
		}
	}, [showName]);

	const nextReview = (e: React.MouseEvent<HTMLButtonElement>) => {
		e.stopPropagation();
		setCurrentReviewIndex((prevIndex) => (prevIndex + 1) % reviews.length);
		setIsExpanded(false);
	};

	const prevReview = (e: React.MouseEvent<HTMLButtonElement>) => {
		e.stopPropagation();
		setCurrentReviewIndex(
			(prevIndex) => (prevIndex - 1 + reviews.length) % reviews.length,
		);
		setIsExpanded(false);
	};

	const toggleExpansion = () => {
		setIsExpanded(!isExpanded);
	};

	const handleKeyDown = (e: React.KeyboardEvent<HTMLDivElement>) => {
		if (e.key === 'Enter') {
			toggleExpansion();
		}
	};

	if (isLoading) {
		return <div className="mt-10 text-2xl text-white">Loading recent reviews...</div>;
	}

	return (
		<div className="flex flex-col items-center rounded-lg bg-gray-100 p-4">
			<h1 className="text-xl font-bold">Recent Reviews</h1>
			{!isLoading && reviews.length > 0 && (
				<div
					className="m-4 w-full max-w-2xl cursor-pointer rounded-lg bg-white p-6 shadow-md"
					onClick={toggleExpansion}
					onKeyDown={handleKeyDown}
				>
					<div className="mb-4 flex items-baseline justify-between">
						<h3 className="text-xl font-semibold text-gray-800">
							{reviews[currentReviewIndex].title}
						</h3>
						<p className="italic text-gray-600">{reviews[currentReviewIndex].source}</p>
					</div>
					{isExpanded ? (
						<div>
							<p className="mb-4 text-gray-700">{reviews[currentReviewIndex].content}</p>
							<div className="flex justify-between text-gray-500">
								<p>{reviews[currentReviewIndex].date_posted}</p>
								{reviews[currentReviewIndex].rating !== undefined && (
									<p className="font-bold">
										Rating: {reviews[currentReviewIndex].rating}
									</p>
								)}
							</div>
						</div>
					) : (
						<h1 className="text-sm italic text-gray-500">Click to read more...</h1>
					)}
					<div className="mt-4 flex justify-between">
						<button onClick={prevReview} className="rounded bg-gray-300 px-4 py-2">
							Previous
						</button>
						<button onClick={nextReview} className="rounded bg-gray-300 px-4 py-2">
							Next
						</button>
					</div>
				</div>
			)}
		</div>
	);
};

export default RecentReviewsList;
