import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getAuth } from "firebase/auth";
import { getStorage } from "firebase/storage";
import { writable } from "svelte/store";
import { type User, onAuthStateChanged } from "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyBbg3Misi5CedRcr2ZsBcQXnikaiJ-foLQ",
  authDomain: "family-tree-data.firebaseapp.com",
  projectId: "family-tree-data",
  storageBucket: "family-tree-data.appspot.com",
  messagingSenderId: "628491609504",
  appId: "1:628491609504:web:1af2394fa4dda5dd72f0c5",
  measurementId: "G-1SLS14HXM7",
};

// Initialize Firebase
export const app = initializeApp(firebaseConfig);
export const db = getFirestore();
export const auth = getAuth();
export const storage = getStorage();

/**
 * @returns A store that tracks the currently signed-in user
 */
function userStore() {
  let unsubscribe: () => void;
  // If Firebase Authentication is not initialized or if the code is
  // running on the server, it returns a store that always has a value of null.
  if (!auth || !globalThis.window) {
    console.warn("Auth is not initialized or not in browser");
    const { subscribe } = writable<User | null>(null);
    return {
      subscribe,
    };
  }

  const { subscribe } = writable(auth?.currentUser ?? null, (set) => {
    unsubscribe = onAuthStateChanged(auth, (user) => {
      set(user);
    });

    return () => unsubscribe();
  });

  return {
    subscribe,
  };
}

export const user = userStore();
