// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAuth, type Auth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyCTN9lmuR5lVbouPC56fcqY6tpGUN-vNtA",
  authDomain: "e-commerce-web-app-2d095.firebaseapp.com",
  projectId: "e-commerce-web-app-2d095",
  storageBucket: "e-commerce-web-app-2d095.firebasestorage.app",
  messagingSenderId: "494755411027",
  appId: "1:494755411027:web:f932fc20d6b95bb64dc2a6",
  measurementId: "G-WH7D9TVHL4"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth: Auth = getAuth(app);
const db = getFirestore(app);

export { auth, db };
