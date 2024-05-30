import { useEffect, useState } from 'react';

import { getReviewsWithPerplexity } from '../../processes/perplexity.mjs';

export type RecentReview = {
	title: string;
	content: string;
	source: string;
	date_posted: string;
	rating?: number;
};

const RecentReviewsList = ({ showName }: { showName: string }) => {
	const [reviews, setReviews] = useState<RecentReview[]>([]);
	const [isLoading, setIsLoading] = useState(false);

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

	if (isLoading) {
		return <div>Loading...</div>;
	}

	return (
		<div className="flex flex-col items-center bg-gray-100 p-4">
			{!isLoading && reviews && reviews.map((review, index) => (
				<div
					key={index}
					className="m-4 w-full max-w-2xl rounded-lg bg-white p-6 shadow-md"
				>
					<div className="mb-4 flex items-baseline justify-between">
						<h3 className="text-xl font-semibold text-gray-800">{review.title}</h3>
						<p className="italic text-gray-600">{review.source}</p>
					</div>
					<p className="mb-4 text-gray-700">{review.content}</p>
					<div className="flex justify-between text-gray-500">
						<p>{review.date_posted}</p>
						{review.rating !== undefined && (
							<p className="font-bold">Rating: {review.rating}</p>
						)}
					</div>
				</div>
			))}
		</div>
	);
};

export default RecentReviewsList;
