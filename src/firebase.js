// src/firebase.js
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";

const firebaseConfig = {
  apiKey: "AIzaSyBTruwAFl4H6XdTyVBlYSw4F8-SUtxqn34",
  authDomain: "mansy-store.firebaseapp.com",
  projectId: "mansy-store",
  storageBucket: "mansy-store.firebasestorage.app",
  messagingSenderId: "652486920965",
  appId: "1:652486920965:web:4891afebb715cd2327856c",
  measurementId: "G-17L5B53RXK"
};

const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);
export const storage = getStorage(app);
