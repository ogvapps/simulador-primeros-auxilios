import { initializeApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';
import { getAuth } from 'firebase/auth';
import { getDatabase } from 'firebase/database';

// Robustly access environment variables to prevent runtime crashes
let env: any = {};

try {
  // Check if import.meta.env exists safely
  const meta = import.meta as any;
  if (typeof meta !== 'undefined' && meta.env) {
    env = meta.env;
  }
} catch (e) {
  console.warn("Error accessing import.meta.env, defaulting to empty object.", e);
}

const firebaseConfig = {
  apiKey: env.VITE_FIREBASE_API_KEY,
  authDomain: env.VITE_FIREBASE_AUTH_DOMAIN,
  databaseURL: env.VITE_FIREBASE_DATABASE_URL,
  projectId: env.VITE_FIREBASE_PROJECT_ID,
  storageBucket: env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId: env.VITE_FIREBASE_APP_ID,
  measurementId: env.VITE_FIREBASE_MEASUREMENT_ID
};

const appId = firebaseConfig.appId;

// Determine if we are in mock mode (if keys are missing)
export const isMock = false; // Force real mode with Firebase

let app;
let db;
let auth;
let rtdb;

if (!isMock) {
  try {
    app = initializeApp(firebaseConfig);
    db = getFirestore(app);
    auth = getAuth(app);
    rtdb = getDatabase(app);
  } catch (error) {
    console.error("Error initializing Firebase:", error);
  }
}

export { app, db, auth, rtdb, appId };
