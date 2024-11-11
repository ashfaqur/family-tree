import { writable } from "svelte/store";
import type { FamilyMember, ProjectData } from "./types/types";
import data from "$lib/data/initialdata.json";
// import data from "$lib/data/private.json";

// Create a writable store with an initial value of "None"
export const selectedProject = writable<ProjectData>(null);

// Create a writable store with an initial value of "None"
export const chartData = writable<FamilyMember[]>(data);
