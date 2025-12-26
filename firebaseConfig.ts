import { initializeApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';
import { getAuth } from 'firebase/auth';
import { getDatabase } from 'firebase/database';

// Firebase configuration - Using environment variables
const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY || "AIzaSyANi0ImaTKfxQUKwPZ0A48cvie5QKN0eFc",
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN || "simulador-primeros-primeros-auxilios-app.firebaseapp.com",
  databaseURL: import.meta.env.VITE_FIREBASE_DATABASE_URL || "https://simulador-primeros-https://primeros-auxilios-app-default-rtdb.europe-west1.firebasedatabase.app",
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID || "simulador-primeros-auxilios-app",
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET || "simulador-primeros-auxilios.primeros-auxilios-app.firebasestorage.app",
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID || "383085206122",
  appId: import.meta.env.VITE_FIREBASE_APP_ID || "1:550556099813:web:1:383085206122:web:87e987fd4f6c41a5f80813",
  measurementId: import.meta.env.VITE_FIREBASE_MEASUREMENT_ID || "G-G-6FE3XD2QT5"
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
