// firebasefunctions.tsx

import { database } from './firebaseconfig';
import { ref, get, child, set } from 'firebase/database';

// Utility function to check if the show exists in Realtime Database
async function checkShowExists(showName: string): Promise<{ exists: boolean, data?: any }> {
  const dbRef = ref(database);
  const snapshot = await get(child(dbRef, `shows/${showName}`));

  if (snapshot.exists()) {
    const showData = snapshot.val();
    console.log(showData);
    return { exists: true, data: showData };
  } else {
    return { exists: false };
  }
}

// Function to get reviews for a given show
async function getReviews(showName: string): Promise<any> {
  const { exists, data } = await checkShowExists(showName);

  console.log(exists);

  if (!exists) {
    console.log(`Show ${showName} not found in the database. Calling Lambda function to scrape and save data.`);
    
    // Call the Lambda function to scrape data


    // Recheck if the show now exists in the database
    const recheck = await checkShowExists(showName);
    if (recheck.exists && recheck.data) {
      return recheck.data.reviews;
    } else {
      throw new Error('Failed to retrieve show data after Lambda function execution.');
    }
  } else {
    console.log(`Show ${showName} found in the database.`);
    return data.reviews;
  }
}

export { getReviews };
