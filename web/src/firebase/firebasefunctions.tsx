import axios, { AxiosResponse } from 'axios';
import { DatabaseReference, get, ref } from 'firebase/database';

import { database } from './firebaseconfig';

// Define the Review type
export type Review = {
	author: string;
	content: string;
	created: string;
	rating?: number;
	show: string;
	source: string;
	title?: string;
	type: 'Human' | 'AI';
	sentiment?: number;
};

export type Show = {
	category: string;
	name: string;
	review_ids: string[];
	season: number;
};

export type ShowName = {
	name: string;
};

// Define the shape of the request data
interface RequestData {
	movie_names: string[];
}

// Define the shape of the response data (update this according to your Lambda response)
interface LambdaResponse {
	statusCode: number;
	body: string;
}

// Utility function to find the show ID by name in Realtime Database
async function findShowIdByName(
	showName: string,
): Promise<{ exists: boolean; showId?: string }> {
	try {
		const dbRef: DatabaseReference = ref(database, 'shows/');
		const snapshot = await get(dbRef);

		if (snapshot.exists()) {
			const showsData = snapshot.val();
			for (const showId in showsData) {
				if (showsData[showId].name === showName) {
					return { exists: true, showId };
				}
			}
		}
		return { exists: false };
	} catch (error) {
		console.error(`Error finding show ID by name: ${error}`);
		throw error;
	}
}

// Utility function to get reviews by their IDs
async function getReviewsByIds(reviewIds: string[]): Promise<Review[]> {
	const reviews: Review[] = [];
	try {
		for (const reviewId of reviewIds) {
			const reviewRef: DatabaseReference = ref(database, `reviews/${reviewId}`);
			const snapshot = await get(reviewRef);
			if (snapshot.exists()) {
				reviews.push(snapshot.val());
			} else {
				console.warn(`Review ID ${reviewId} not found.`);
			}
		}
	} catch (error) {
		console.error(`Error getting reviews by IDs: ${error}`);
		throw error;
	}
	return reviews;
}

// API URL for the Lambda function
const apiUrl = 'https://4obuajxcu7.execute-api.us-east-2.amazonaws.com/Deployed/scraper';

// Function to get reviews for a given show
async function getReviews(showName: string): Promise<Review[]> {
	try {
		const { exists, showId } = await findShowIdByName(showName);
		if (!exists || !showId) {
			console.log(
				`Show ${showName} not found in the database. Calling Lambda function to scrape and save data.`,
			);
			try {
				const requestData: RequestData = { movie_names: [showName] };
				const response: AxiosResponse<LambdaResponse> = await axios.post(
					apiUrl,
					requestData,
				);
				// Check if the Lambda function executed successfully
				if (response.status !== 200) {
					throw new Error(`Lambda function returned an error: ${response.data.body}`);
				}
			} catch (error) {
				if (axios.isAxiosError(error) && error.response) {
					// Handle known Axios error structure
					console.error(`Error calling Lambda function: ${error.response.data}`);
					throw new Error(error.response.data.message);
				} else {
					// Handle unknown errors
					console.error(`Unknown error calling Lambda function: ${error}`);
					throw new Error('An unknown error occurred while calling the Lambda function.');
				}
			}
			// Recheck if the show now exists in the database
			const recheck = await findShowIdByName(showName);
			if (recheck.exists && recheck.showId) {
				const showData = await fetchShowData(recheck.showId);
				const reviews = await getReviewsByIds(showData.review_ids);
				return reviews;
			} else {
				throw new Error('Failed to retrieve show data after Lambda function execution.');
			}
		} else {
			console.log(`Show ${showName} found in the database.`);
			const showData = await fetchShowData(showId);
			const reviews = await getReviewsByIds(showData.review_ids);
			return reviews;
		}
	} catch (error) {
		console.error(`Error getting reviews for show ${showName}: ${error}`);
		throw error;
	}
}

// Helper function to fetch show data by show ID
async function fetchShowData(showId: string): Promise<Show> {
	try {
		const showDataRef: DatabaseReference = ref(database, `shows/${showId}`);
		const showDataSnapshot = await get(showDataRef);
		if (showDataSnapshot.exists()) {
			return showDataSnapshot.val();
		} else {
			throw new Error(`Show data for ID ${showId} not found.`);
		}
	} catch (error) {
		console.error(`Error fetching show data: ${error}`);
		throw error;
	}
}

function snakeToNormalText(snakeCaseString: string) {
	return snakeCaseString
		.split('_') // Split the string by underscores
		.map((word) => word.charAt(0).toUpperCase() + word.slice(1)) // Capitalize the first letter of each word
		.join(' '); // Join the words back with spaces
}

async function getShowList(): Promise<ShowName[]> {
	try {
		const showRef = ref(database, 'shows/');
		const showsSnapshot = await get(showRef);
		if (showsSnapshot.exists()) {
			const showsData: { [key: string]: Show } = showsSnapshot.val();
			const shows: ShowName[] = Object.values(showsData).map((show: Show) => ({
				name: show.season
					? `${snakeToNormalText(show.name)} (Season ${show.season})`
					: snakeToNormalText(show.name),
			}));
			return shows;
		} else {
			throw new Error('Show list not found');
		}
	} catch (e) {
		console.error(e);
		return [];
	}
}

async function getPlatformData() {
	console.log('Getting platform data');
	// let reviewsData = await getReviews(showName);  // TODO: blocked by firebase functions
	let reviewsData;

	// TODO: workaround below: using the whole reviews list instead of filtered by show
	try {
		const reviewsRef = ref(database, 'reviews/');
		const reviewsSnapshot = await get(reviewsRef);

		if (reviewsSnapshot.exists()) {
			reviewsData = reviewsSnapshot.val(); // { reviewId: { source: 'IMDb', rating: 1.6 }, ...
			// console.log("reviewsData", reviewsData);
		} else {
			throw new Error(`Review list not found `);
		}
	} catch (e) {
		console.error(e);
		return [];
	}

	const platformDataDict: { [key: string]: number } = {};
	let count = 0;
	for (const reviewId in reviewsData) {
		const review: Review = reviewsData[reviewId];
		if (!('source' in review) || !('rating' in review)) {
			continue;
		}
		count += 1;
		const source = review.source;
		const rating = review.rating;
		if (typeof rating === 'number') {
			if (source in platformDataDict) {
				platformDataDict[source] += rating;
			} else {
				platformDataDict[source] = rating;
			}
		}
	}

	for (const source in platformDataDict) {
		platformDataDict[source] /= count;
	}

	// convert to array of objects
	const platformData = Object.entries(platformDataDict).map(([name, number]) => ({
		name,
		number,
	}));
	console.log('platformData', platformData);

	return platformData;
}

export { getPlatformData, getReviews, getShowList };
