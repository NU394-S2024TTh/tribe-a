// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { GoogleAuthProvider } from "firebase/auth";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries
import { getDatabase } from "firebase/database";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";

// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyCnuMC_z7VzfUbenom-o5BabtDp7Y44XmQ",
  authDomain: "streaming-trends-ai.firebaseapp.com",
  databaseURL: "https://streaming-trends-ai-default-rtdb.firebaseio.com",
  projectId: "streaming-trends-ai",
  storageBucket: "streaming-trends-ai.appspot.com",
  messagingSenderId: "87491496988",
  appId: "1:87491496988:web:dba2be4cbfd7e79a23a3d9",
  measurementId: "G-F8STDLCTP9"
};


export const app = initializeApp(firebaseConfig);

// Initialize Realtime Database and get a reference to the service
export const database = getDatabase(app);

export const db = getFirestore(app);
export const storage = getStorage(app);

export const auth = getAuth(app);

export const provider = new GoogleAuthProvider();
