import React from 'react';

import Tabs from '../components/charts/ChartTabNav';
import ReviewsInput from '../components/reviews/ReviewsInput';

interface DataPoint {
	name: string;
	number: number;
}

interface SentimentAnalysisProps {
	showName: string | null;
	data: DataPoint[] | null;
}

export default function SentimentAnalysis({ showName, data }: SentimentAnalysisProps) {
	if (!showName || !data) {
		return (
			<div className="flex h-full items-center justify-center text-white">
				<p>Select a show to view its sentiment analysis.</p>
			</div>
		);
	}

	return (
		<div className="flex h-full flex-col items-center justify-center">
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
