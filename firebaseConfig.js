// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
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

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
