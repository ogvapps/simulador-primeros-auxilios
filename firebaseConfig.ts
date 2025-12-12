import { initializeApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';
import { getAuth } from 'firebase/auth';
import { getDatabase } from 'firebase/database';

const firebaseConfig = {
  apiKey: "AIzaSyANi0ImaTKfxQUKwPZ0A48cvie5QKN0eFo",
  authDomain: "primeros-auxilios-app.firebaseapp.com",
  databaseURL: "https://primeros-auxilios-app-default-rtdb.firebaseio.com",
  projectId: "primeros-auxilios-app",
  storageBucket: "primeros-auxilios-app.firebasestorage.app",
  messagingSenderId: "383085206122",
  appId: "1:383085206122:web:87e987fd4f6c41a5f80813",
  measurementId: "G-6FE3XD2QT5"
};

const appId = firebaseConfig.appId;

export const isMock = !firebaseConfig.apiKey || firebaseConfig.apiKey === 'mock-key' || firebaseConfig.apiKey.includes('mock');

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
const auth = getAuth(app);
const rtdb = getDatabase(app); // Realtime Database for Multiplayer

export { app, db, auth, rtdb, appId };