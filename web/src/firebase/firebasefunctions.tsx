// firebasefunctions.tsx

import { db } from './firebaseconfig';
import { collection, query, where, getDocs, setDoc, doc } from 'firebase/firestore';
import axios from 'axios';

// Utility function to check if the show exists in Firestore
async function checkShowExists(showName: string): Promise<{ exists: boolean, data?: any }> {
  const showsRef = collection(db, 'shows');
  const q = query(showsRef, where('name', '==', showName));
  const querySnapshot = await getDocs(q);

  if (querySnapshot.empty) {
    return { exists: false };
  } else {
    let showData: any;
    querySnapshot.forEach((doc) => {
      showData = doc.data();
      console.log(showData);
    });
    return { exists: true, data: showData };
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