import { initializeApp } from 'firebase/app';
import { getAuth, connectAuthEmulator } from 'firebase/auth';
import { initializeFirestore, persistentLocalCache, persistentMultipleTabManager, connectFirestoreEmulator } from 'firebase/firestore';

const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY || 'AIzaSyANi0ImaTKfxQUKwPZ0A48cvie5QKN0eFo',
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN || 'primeros-auxilios-app.firebaseapp.com',
  databaseURL: import.meta.env.VITE_FIREBASE_DATABASE_URL || 'https://primeros-auxilios-app-default-rtdb.firebaseio.com',
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID || 'primeros-auxilios-app',
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET || 'primeros-auxilios-app.firebasestorage.app',
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID || '383085206122',
  appId: import.meta.env.VITE_FIREBASE_APP_ID || '1:383085206122:web:87e987fd4f6c41a5f80813',
  measurementId: import.meta.env.VITE_FIREBASE_MEASUREMENT_ID || 'G-6FE3XD2QT5',
};

const app = initializeApp(firebaseConfig);

const db = initializeFirestore(app, {
  localCache: persistentLocalCache({ tabManager: persistentMultipleTabManager() }),
});

const auth = getAuth(app);

// Admin security pin from env
export const ADMIN_PIN = import.meta.env.VITE_ADMIN_PIN || '1120';

export { app, db, auth };
export default firebaseConfig;
