import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getAuth } from "firebase/auth";
import { getStorage } from "firebase/storage";

const firebaseConfig = {
  apiKey: "AIzaSyBbg3Misi5CedRcr2ZsBcQXnikaiJ-foLQ",
  authDomain: "family-tree-data.firebaseapp.com",
  projectId: "family-tree-data",
  storageBucket: "family-tree-data.appspot.com",
  messagingSenderId: "628491609504",
  appId: "1:628491609504:web:1af2394fa4dda5dd72f0c5",
};

// Initialize Firebase
export const app = initializeApp(firebaseConfig);
export const db = getFirestore();
export const auth = getAuth();
export const storage = getStorage();
