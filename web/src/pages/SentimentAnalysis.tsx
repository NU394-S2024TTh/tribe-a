import React from 'react';

import Tabs from '../components/charts/ChartTabNav';
import RecentReviewsList from '../components/reviews/RecentReviewsList';

interface SentimentAnalysisProps {
	showName: string;
	data: number[];
}

export default function SentimentAnalysis({ showName, data }: SentimentAnalysisProps) {
	return (
		<div className="flex h-full flex-col items-center justify-center transition-all duration-700">
			<h1 className="mb-8 text-3xl font-bold text-white">{showName}</h1>
			<div className="mb-8">
				<Tabs data={data}></Tabs>
			</div>
			<div>
				<RecentReviewsList showName={showName} />
			</div>
		</div>
	);
}
