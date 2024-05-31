
import fs from 'fs/promises';
import path from 'path';

// Import the functions you need from the SDKs you need
import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { GoogleAuthProvider } from 'firebase/auth';
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries
import { getDatabase, update } from 'firebase/database';
import { getStorage } from 'firebase/storage';
import { getFirestore, addDoc, collection, doc, getDoc, query, where, getDocs, updateDoc } from 'firebase/firestore';

// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
	apiKey: 'AIzaSyCnuMC_z7VzfUbenom-o5BabtDp7Y44XmQ',
	authDomain: 'streaming-trends-ai.firebaseapp.com',
	databaseURL: 'https://streaming-trends-ai-default-rtdb.firebaseio.com',
	projectId: 'streaming-trends-ai',
	storageBucket: 'streaming-trends-ai.appspot.com',
	messagingSenderId: '87491496988',
	appId: '1:87491496988:web:dba2be4cbfd7e79a23a3d9',
	measurementId: 'G-F8STDLCTP9',
};

export const app = initializeApp(firebaseConfig);

// Initialize Realtime Database and get a reference to the service
export const database = getDatabase(app);

export const db = getFirestore(app);
export const storage = getStorage(app);

export const auth = getAuth(app);

export const provider = new GoogleAuthProvider();


export async function processJson(filePath) {
  // read jsons from a file
  const file = await fs.readFile(filePath, 'utf-8');
  const json = JSON.parse(file);
  // loop key and value of json
  // const newJson = {"Reviews": {}};
  let count = 0;
  const entries = Object.entries(json).slice(0, 200);
  const reviewsRef = await collection(db, "Reviews");
  for (const [key, value] of entries){
    // console.log(key, value);
    // remove the field with empty value
    for (const [k, v] of Object.entries(value)){
      if (v === ''){
        delete value[k];
      }
    }
    // make sure the content is not in the database
    const q = query(reviewsRef, where("input", "==", JSON.stringify(value)));
    const querySnapshot = await getDocs(q);

    if (!querySnapshot.empty){
      // console.log("Content already exists in the database");
      // set the key to the review_id for the existing content
      const _doc = querySnapshot.docs[0];
      const docRef = _doc.ref;
      const updatedData = {
        review_id: key
      };
      await updateDoc(docRef, updatedData);

      // set the field of seen to true in Realtime Database
      const reviewRTDBRef = doc(database, "Reviews", key);
      update(reviewRTDBRef, {
        seen: true
      });
      continue;
    }

    addDoc(reviewsRef, {
      input: JSON.stringify(value),
      review_id: key
    });
    // set the field of seen to true in Realtime Database
    const reviewRTDBRef = doc(database, "Reviews", key);
    update(reviewRTDBRef, {
      seen: true
    });
    alert("updated data in Realtime Database: ", reviewRTDBRef);
    count += 1;
  }
  console.log("new review count:", count);
}

processJson(path.resolve('streaming-trends-ai-default-rtdb-export.json'));