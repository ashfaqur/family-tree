import { writable } from "svelte/store";
import { auth, user, db } from "$lib/firebase";
import { getDoc, setDoc, doc } from "firebase/firestore";
import data from "$lib/data/initialdata.json";
// import data from "$lib/data/private.json";
import type { FamilyMember, ProjectData, UserData } from "./types/types";
import type { User } from "firebase/auth";

export const selectedProject = writable<ProjectData>(null);

export const chartData = writable<FamilyMember[]>(data);

const USERS_COLLECTION = "users";
const PROJECTS_COLLECTION = "projects";

export async function saveUser(user: UserData) {
  if (!user) {
    console.error("Unable to save user to Firestore. Details: User undefined!");
    return;
  }
  try {
    const userRef = doc(db, USERS_COLLECTION, user.uid);
    const userDoc = await getDoc(userRef);
    const userData: UserData = {
      uid: user.uid,
      displayName: user.displayName,
      email: user.email,
      photoURL: user.photoURL,
    };
    if (userDoc.exists()) {
      // User exists, update only the necessary fields
      await setDoc(userRef, userData, { merge: true });
      console.log(
        `User with name ${user.displayName} with id ${user.uid} is updated in Firestore`
      );
    } else {
      // User does not exist, create a new document
      await setDoc(userRef, userData);
      console.log(
        `User with name ${user.displayName} with id ${user.uid} is created in Firestore`
      );
    }
  } catch (error) {
    console.error("Error saving user to Firestore: Details:", error);
  }
}
