import React from 'react';

import Tabs from '../components/charts/ChartTabNav';
import ReviewsInput from '../components/reviews/ReviewsInput';

interface SentimentAnalysisProps {
    showName: string | null;
    data: { sentiment: number; created: string }[];
}

export default function SentimentAnalysis({ showName, data }: SentimentAnalysisProps) {
	console.log('Sentiment analysis here')
	console.log(data)
	return (
		<div className="flex h-full flex-col items-center justify-center transition-all duration-700">
			<h1 className="mb-8 text-3xl font-bold text-white">{showName}</h1>
			<div className="mb-8">
				<Tabs data={data}></Tabs>
			</div>
			<div>
				<ReviewsInput />
			</div>
		</div>
	);
}
