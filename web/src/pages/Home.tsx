import React, { useState } from 'react';
import Tabs from '../components/Chart/charttabnav';
import ReviewsInput from '../components/ReviewsInput/reviewsinput';
// @ts-ignore
import { sentimentAnalyzer } from '../../../processes/sentimentAnalyzer.mjs';
// import { TEST_DATA } from '../components/Chart/testdata';

export default function Home() {
	const [reviews, setReviews] = useState<string[]>([]);
	const [sentiments, setSentiments] = useState<number[]>([]);

	async function getSentiments(reviews: string[]) {
		const sentiments = [];
		for (const review of reviews) {
		  const response = await sentimentAnalyzer.getSentiment(review);
		  sentiments.push(response);
		}
		return sentiments;
	}

	const handleSubmit = (reviews: string[]) => {
        setReviews(reviews);
		getSentiments(reviews)
			.then(sentiments => {
				setSentiments(sentiments); // Array of sentiment numbers
				console.log(sentiments);
			})
			.catch(error => {
				console.error(error);
			});
    };

	return (
		<div className="flex h-screen flex-col items-center justify-center bg-[#132a3a]">
			<div className="mt-20">
        		<ReviewsInput handleSubmit={handleSubmit}/>
				<Tabs data={
					reviews.map((review, index) => ({
						name: (index + 1).toString(),
						number: sentiments[index],
					}))
				}></Tabs>
			</div>
		</div>
	);
}
