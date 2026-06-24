import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getDatabase } from "firebase/database";

// Only include databaseURL when it contains a real value.
// Passing a placeholder causes a Firebase fatal URL-parse error.
const rawDbUrl = process.env.REACT_APP_FIREBASE_DB_URL || "";
const hasRealDbUrl = rawDbUrl.length > 0 && !rawDbUrl.includes("YOUR_");

const firebaseConfig = {
  apiKey:            process.env.REACT_APP_FIREBASE_API_KEY,
  authDomain:        `${process.env.REACT_APP_FIREBASE_PROJECT_ID || "placeholder"}.firebaseapp.com`,
  projectId:         process.env.REACT_APP_FIREBASE_PROJECT_ID,
  storageBucket:     `${process.env.REACT_APP_FIREBASE_PROJECT_ID || "placeholder"}.appspot.com`,
  messagingSenderId: process.env.REACT_APP_FIREBASE_MESSAGING_SENDER_ID,
  appId:             process.env.REACT_APP_FIREBASE_APP_ID,
  ...(hasRealDbUrl ? { databaseURL: rawDbUrl } : {}),
};

const app      = initializeApp(firebaseConfig);
const auth     = getAuth(app);
const database = hasRealDbUrl ? getDatabase(app) : null;

export { app, auth, database };


