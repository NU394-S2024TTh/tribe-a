//firebasefunctions.mjs: 

// import { database } from './firebaseconfig.js';
// import { ref, get, child } from 'firebase/database';

// // Utility function to find the show ID by name in Realtime Database
// async function findShowIdByName(showName) {
//   const dbRef = ref(database, 'shows/');
//   const snapshot = await get(dbRef);

//   if (snapshot.exists()) {
//     const showsData = snapshot.val();
//     for (const showId in showsData) {
//       if (showsData[showId].name === showName) {
//         return { exists: true, showId };
//       }
//     }
//   }
//   return { exists: false };
// }

// // Utility function to get reviews by their IDs
// async function getReviewsByIds(reviewIds) {
//   const reviews = [];
//   for (const reviewId of reviewIds) {
//     const reviewRef = ref(database, `reviews/reviews/`);
//     const snapshot = await get(reviewRef);
//     //console.log('Snapshot:', snapshot);
//     if (snapshot.exists()) {
//       //console.log('Review Data:', snapshot.val());
//       reviews.push(snapshot.val());
//     } else {
//       console.warn(`Review ID ${reviewId} not found.`);
//     }
//   }
//   return reviews;
// }

// // Function to get reviews for a given show
// async function getReviews(showName) {
//   const { exists, showId } = await findShowIdByName(showName);

//   console.log(exists);

//   if (!exists) {
//     console.log(`Show ${showName} not found in the database. Calling Lambda function to scrape and save data.`);
    
//     // Call the Lambda function to scrape data


//     // Recheck if the show now exists in the database
//     const recheck = await findShowIdByName(showName);
//     if (recheck.exists && recheck.showId) {
//       const showDataRef = ref(database, `shows/${recheck.showId}`);
//       const showDataSnapshot = await get(showDataRef);
//       const showData = showDataSnapshot.val();

//       const reviews = await getReviewsByIds(showData.review_ids);
//       return reviews;
//     } else {
//       throw new Error('Failed to retrieve show data after Lambda function execution.');
//     }
//   } else {
//     console.log(`Show ${showName} found in the database.`);
//     const showDataRef = ref(database, `shows/${showId}`);
//     const showDataSnapshot = await get(showDataRef);
//     const showData = showDataSnapshot.val();
//     console.log(showData.review_ids);
//     const reviews = await getReviewsByIds(showData.review_ids);
//     return reviews;
//   }
// }

// // testing
// (async () => {
//   try {
//     const reviews = await getReviews('startrekpicard');
//     console.log(reviews);
//   } catch (error) {
//     console.error('Error:', error);
//   }
// })();


// export { getReviews };

// firebasefunctions.tsx:

import { database } from './firebaseconfig';
import { ref, get } from 'firebase/database';

// Utility function to find the show ID by name in Realtime Database
async function findShowIdByName(showName: string): Promise<{ exists: boolean; showId?: string }> {
  const dbRef = ref(database, 'shows/');
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
}

// Utility function to get reviews by their IDs
async function getReviewsByIds(reviewIds: string[]): Promise<any[]> {
  const reviews: any[] = [];
  for (const reviewId of reviewIds) {
    const reviewRef = ref(database, `reviews/reviews/`);
    const snapshot = await get(reviewRef);
    if (snapshot.exists()) {
      reviews.push(snapshot.val());
    } else {
      console.warn(`Review ID ${reviewId} not found.`);
    }
  }
  return reviews;
}

// Function to get reviews for a given show
async function getReviews(showName: string): Promise<any[]> {
  const { exists, showId } = await findShowIdByName(showName);

  console.log('Show exists:', exists);

  if (!exists) {
    console.log(`Show ${showName} not found in the database. Calling Lambda function to scrape and save data.`);
    
    // Call the Lambda function to scrape data


    // Recheck if the show now exists in the database
    const recheck = await findShowIdByName(showName);
    if (recheck.exists && recheck.showId) {
      const showDataRef = ref(database, `shows/${recheck.showId}`);
      const showDataSnapshot = await get(showDataRef);
      const showData = showDataSnapshot.val();

      const reviews = await getReviewsByIds(showData.review_ids);
      return reviews;
    } else {
      throw new Error('Failed to retrieve show data after Lambda function execution.');
    }
  } else {
    console.log(`Show ${showName} found in the database.`);
    const showDataRef = ref(database, `shows/${showId}`);
    const showDataSnapshot = await get(showDataRef);
    const showData = showDataSnapshot.val();

    const reviews = await getReviewsByIds(showData.review_ids);
    return reviews;
  }
}

// Testing function
(async () => {
  try {
    const reviews = await getReviews('startrekpicard');
    console.log('Fetched Reviews:', reviews);
  } catch (error) {
    console.error('Error:', error);
  }
})();

export { getReviews };
