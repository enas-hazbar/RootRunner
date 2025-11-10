// src/firebase.js
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";

// your Firebase config from the console
const firebaseConfig = {
  apiKey: "AIzaSyD1-75iO4rk02mSP5s-Vz9J7F1NL_1Jln4",
  authDomain: "rootrunner-c407e.firebaseapp.com",
  projectId: "rootrunner-c407e",
  storageBucket: "rootrunner-c407e.appspot.com", // <-- fix this small part (remove "firebasestorage.app")
  messagingSenderId: "160537226791",
  appId: "1:160537226791:web:cf0bc1abd74e3318662802",
  measurementId: "G-H1DFBR87X5"
};

// initialize Firebase app
const app = initializeApp(firebaseConfig);

// initialize services
export const auth = getAuth(app);
export const db = getFirestore(app);
export const storage = getStorage(app);
