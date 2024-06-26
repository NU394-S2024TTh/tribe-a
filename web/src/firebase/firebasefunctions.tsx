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

export type ReviewSentimentData = {
	sentiment: number;
	created: string;
	source: string;
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
					JSON.stringify(requestData),
				);
				console.log(response);
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

function getPlatformData(reviewsData: ReviewSentimentData[]) {
	console.log(reviewsData);
	console.log('Getting platform data');

	const platformDataDict: { [key: string]: { totalRating: number; count: number } } = {};

	for (const review of reviewsData) {
		if (!('source' in review) || !('sentiment' in review)) {
			continue;
		}

		const source = review.source;
		const rating = review.sentiment;

		if (typeof rating === 'number') {
			if (source in platformDataDict) {
				platformDataDict[source].totalRating += rating;
				platformDataDict[source].count += 1;
			} else {
				platformDataDict[source] = { totalRating: rating, count: 1 };
			}
		}
	}

	// Calculating the average rating for each source
	const platformData = Object.entries(platformDataDict).map(([source, data]) => ({
		name: source,
		number: data.totalRating / data.count,
	}));

	console.log(platformData);

	return platformData;
}

export function formatShowName(showName: string) {
	// Remove the season information (e.g., "(Season 3)")
	const nameWithoutSeason = showName.replace(/\s*\(Season \d+\)\s*$/i, '');

	// Remove colons, replace spaces with underscores, and convert to lowercase
	return nameWithoutSeason.replace(/:/g, '').replace(/\s+/g, '_').toLowerCase();
}

export { getPlatformData, getReviews, getShowList };
