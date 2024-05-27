import { ref } from 'firebase/database';
import { onValue, set } from 'firebase/database';
import React, { useEffect, useState } from 'react';

import { database } from '../../firebase/firebaseconfig';
import sentimentAnalyzer from '../../processes/SentimentAnalyzer.mjs';

export default function ReviewsInput() {
	const [input, setInput] = useState<string>('');
	const [reviews, setReviews] = useState<string[]>([]);

	// run sentiment analysis on reviews state change
	async function handleReviewsChange(reviews: string[]) {
		console.log('Reviews state changed: ', reviews);
		const sentiments = await sentimentAnalyzer.getSentiments(reviews); // run sentiment analysis on reviews
		for (let i = 0; i < reviews.length; i++) {
			alert(`Review: ${reviews[i]}\nSentiment: ${sentiments[i]}`); // alert sentiment analysis results
		}
		return sentiments;
	}
	const dbRef = ref(database, 'reviews/');
	onValue(dbRef, (snapshot) => {
		// from new value, then handleReviewsChange
		const reviews = snapshot.val();
		handleReviewsChange(reviews);
	});

	useEffect(() => {
		set(dbRef, reviews);
	}, [reviews]);

	const handleInputChange = (event: React.ChangeEvent<HTMLTextAreaElement>) => {
		setInput(event.target.value);
	};

	const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
		event.preventDefault();
		// splits reviews by new line
		setReviews(input.trim().split('\n'));
		// console.log(input.trim().split('\n'));
	};

	return (
		<div className="my-5 flex items-center justify-center">
			<form onSubmit={handleSubmit} className="w-full max-w-sm">
				<label htmlFor="textInput" className="mb-2 block text-white">
					Enter reviews:
				</label>
				<textarea
					id="textInput"
					value={input}
					onChange={handleInputChange}
					className="w-full resize-none rounded-md border px-3 py-2 focus:border-custom-theme-2 focus:outline-none"
					rows={4}
				/>
				<button
					type="submit"
					className="mt-2 w-full rounded-md border border-white bg-custom-theme-2 px-4 py-2 text-white hover:bg-custom-theme-2b focus:bg-custom-theme-2 focus:outline-none"
				>
					Submit
				</button>
			</form>
		</div>
	);
}
