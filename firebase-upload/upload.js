const admin = require('firebase-admin');
const fs = require('fs');
const path = require('path');

// Path to your service account key JSON file
const serviceAccount = require('./streaming-trends-ai-firebase-xxxxxxreplace this with your ownxxxxx.json');

// Initialize Firebase Admin
admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  databaseURL: "https://streaming-trends-ai-default-rtdb.firebaseio.com"
});

const db = admin.database();

// Function to upload JSON data to Firebase
// function uploadJSON(filePath, firebasePath) {
//   const data = JSON.parse(fs.readFileSync(filePath, 'utf8'));
//   const ref = db.ref(firebasePath);
//   ref.set(data, (error) => {
//     if (error) {
//       console.log(`Error uploading ${filePath}:`, error);
//     } else {
//       console.log(`Uploaded ${filePath} to ${firebasePath}`);
//     }
//   });
// }
function uploadJSON(filePath, firebasePath) {
  console.log(`Uploading file: ${filePath} to ${firebasePath}`);
  try {
    const data = JSON.parse(fs.readFileSync(filePath, 'utf8'));
    const ref = db.ref(firebasePath);
    ref.set(data, (error) => {
      if (error) {
        console.log(`Error uploading ${filePath}:`, error);
      } else {
        console.log(`Uploaded ${filePath} to ${firebasePath}`);
      }
    });
  } catch (error) {
    console.error(`Failed to parse JSON in file ${filePath}:`, error.message);
  }
}

// Function to recursively read directory and upload JSON files
function readDirectory(directoryPath, firebasePath) {
  fs.readdir(directoryPath, (err, files) => {
    if (err) {
      console.log(`Error reading directory ${directoryPath}:`, err);
      return;
    }
    files.forEach((file) => {
      const fullPath = path.join(directoryPath, file);
      const newFirebasePath = `${firebasePath}/${file.replace('.json', '')}`;
      if (fs.lstatSync(fullPath).isDirectory()) {
        readDirectory(fullPath, newFirebasePath);
      } else if (path.extname(fullPath) === '.json') {
        uploadJSON(fullPath, newFirebasePath);
      }
    });
  });
}

// Start uploading
readDirectory('/Users/katrina/Desktop/tribe-a/reviews', '/reviews');
