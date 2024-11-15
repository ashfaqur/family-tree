import { writable } from "svelte/store";
import { db } from "$lib/firebase";
import {
  getDoc,
  setDoc,
  deleteDoc,
  doc,
  collection,
  getDocs,
  query,
  where,
} from "firebase/firestore";
import data from "$lib/data/initialdata.json";
// import data from "$lib/data/private.json";
import type { FamilyMember, ProjectData, UserData } from "./types/types";
import type { User } from "firebase/auth";

export const selectedProject = writable<ProjectData>(null);

export const chartData = writable<FamilyMember[]>(data);

const USERS_COLLECTION = "users";
const PROJECTS_COLLECTION = "projects";

/**
 * Saves or updates a user's data in the Firestore database.
 *
 * @param user - The user data to be saved or updated. This includes fields
 *               such as uid, displayName, email, and photoURL.
 */
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

export async function setUserSelectedProjectId(
  userId: string,
  projectId: string
) {
  const userRef = doc(db, USERS_COLLECTION, userId);
  await setDoc(
    userRef,
    {
      project: projectId,
    },
    { merge: true }
  ).catch((error) => {
    console.error("Error setting user selected project: Details:", error);
  });
}

/**
 * Retrieves the selected project ID for a given user from Firestore.
 *
 * @param userId - The ID of the user whose selected project ID is to be retrieved.
 * @returns A promise that resolves to the project ID if found, or null if not found
 *          or if the user document does not exist.
 */
export async function getUserSelectedProjectId(
  userId: string
): Promise<string> {
  if (!userId) {
    console.error("Unable to get user selected project. No user id provided");
    return null;
  }
  let userProject: string = null;
  try {
    const userDoc = await getDoc(doc(db, USERS_COLLECTION, userId));
    if (userDoc.exists()) {
      const userData: UserData = userDoc.data();
      if (userData) {
        if (userData.project) {
          userProject = userData.project;
          console.log("Found user selected project id ", userData.project);
        } else {
          console.log(
            "Unable to get user selected project. No project id found"
          );
        }
      } else {
        console.log("Unable to get user selected project. User data undefined");
      }
    } else {
      console.log(
        "Unable to get user selected project. No user document found"
      );
    }
  } catch (error) {
    console.error("Error getting user selected project: Details:", error);
  }
  return userProject;
}

/**
 * Retrieves a project document from the Firestore database and returns its data.
 *
 * @param projectUid - The unique ID of the project document to be retrieved.
 * @returns A promise that resolves to the project data if found, or null if not
 *          found or if an error occurred.
 */
export async function getProjectData(projectUid: string): Promise<ProjectData> {
  if (!projectUid) {
    console.error("Unable to get project data. No project id provided");
    return null;
  }
  try {
    const projectRef = doc(db, PROJECTS_COLLECTION, projectUid);
    const projectDoc = await getDoc(projectRef);
    if (projectDoc.exists()) {
      const projectData: ProjectData = projectDoc.data();
      return projectData;
    }
  } catch (error) {
    console.error("Error getting project data: Details:", error);
  }
  return null;
}

/**
 * Retrieves all project documents in the Firestore database that include the
 * given user email in their "viewers" field. This is used to populate the
 * project dropdown for the user.
 *
 * @param userEmail - The email address of the user whose projects to retrieve.
 * @returns A promise that resolves to an array of project data objects, or an
 *          empty array if no projects were found or if an error occurred.
 */
export async function getUserProjects(
  userEmail: string
): Promise<ProjectData[]> {
  if (!userEmail) {
    console.error("Unable to get user projects. No user email provided");
    return [];
  }
  let userProjects: ProjectData[] = [];
  const projectsRef = collection(db, PROJECTS_COLLECTION);
  const q = query(projectsRef, where("viewers", "array-contains", userEmail));
  try {
    const querySnapshot = await getDocs(q);
    querySnapshot.forEach((doc) => {
      userProjects.push(doc.data());
    });
  } catch (error) {
    console.error("Error retrieving user projects:", error);
  }
  if (userProjects.length > 0) {
    console.log("Projects containing user email:", userProjects);
  } else {
    console.log("No projects found containing user email");
  }
  return userProjects;
}

export async function createProject(projectData: ProjectData) {
  if (!projectData) {
    console.error("Unable to update project. No project data provided");
    return;
  }
  const projectsRef = collection(db, PROJECTS_COLLECTION);
  const newProjectRef = doc(projectsRef);
  projectData.uid = newProjectRef.id; // This gets the auto-generated ID

  await setDoc(newProjectRef, projectData).catch((error) => {
    console.error("Error creating project. Details:", error);
  });
}

export async function updateProject(projectData: ProjectData) {
  if (!projectData) {
    console.error("Unable to update project. No project data provided");
    return;
  }
  const projectRef = doc(db, PROJECTS_COLLECTION, projectData.uid);
  await setDoc(projectRef, projectData).catch((error) => {
    console.error("Error updating project. Details:", error);
  });
}

export async function delteProject(projectId: string) {
  if (!projectId) {
    console.error("Unable to delete project. No project id provided");
    return;
  }
  const projectRef = doc(db, PROJECTS_COLLECTION, projectId);
  await deleteDoc(projectRef).catch((error) => {
    console.error(
      "Error deleting project with id " + projectId + " . Details:",
      error
    );
  });
}
