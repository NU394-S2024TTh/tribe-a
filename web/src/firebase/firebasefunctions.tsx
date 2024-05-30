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
	seaason: number;
};

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

// Function to get reviews for a given show
async function getReviews(showName: string): Promise<Review[]> {
	try {
		const { exists, showId } = await findShowIdByName(showName);

		if (!exists || !showId) {
			console.log(
				`Show ${showName} not found in the database. Calling Lambda function to scrape and save data.`,
			);

			// Call the Lambda function to scrape data (assumed to be implemented elsewhere)

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

async function getShowList() {
	try {
		const showRef = ref(database, 'shows/');
		const showsSnapshot = await get(showRef);
		if (showsSnapshot.exists()) {
			console.log(showsSnapshot.val());
			return showsSnapshot.val();
		} else {
			throw new Error(`Show list not found `);
		}
	} catch (e) {
		console.error(e);
	}
}

export { getReviews, getShowList };
