import { initializeApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';
import { getAuth } from 'firebase/auth';
import { getDatabase } from 'firebase/database';

// Firebase configuration - Using environment variables
const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY || "AIzaSyCBV_OUt9F8mQQ4x7C2Z0JVqY8jg4xKZ3s",
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN || "simulador-primeros-auxilios.firebaseapp.com",
  databaseURL: import.meta.env.VITE_FIREBASE_DATABASE_URL || "https://simulador-primeros-auxilios-default-rtdb.europe-west1.firebasedatabase.app",
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID || "simulador-primeros-auxilios",
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET || "simulador-primeros-auxilios.firebasestorage.app",
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID || "550556099813",
  appId: import.meta.env.VITE_FIREBASE_APP_ID || "1:550556099813:web:b4e74745f0b18ae3e37686",
  measurementId: import.meta.env.VITE_FIREBASE_MEASUREMENT_ID || "G-G5DKLCV8K8"
};

const appId = firebaseConfig.projectId;

// Initialize Firebase
let app;
let db;
let auth;
let rtdb;

try {
  app = initializeApp(firebaseConfig);
  db = getFirestore(app);
  auth = getAuth(app);
  rtdb = getDatabase(app);
  console.log('Firebase initialized successfully');
} catch (error) {
  console.error('Error initializing Firebase:', error);
}

// Firebase is always active - no mock mode
export const isMock = false;

export { app, db, auth, rtdb, appId };
