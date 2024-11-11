import { writable } from "svelte/store";
import type { FamilyMember, ProjectData } from "./types/types";
import data from "$lib/data/initialdata.json";
// import data from "$lib/data/private.json";

export const selectedProject = writable<ProjectData>(null);

export const chartData = writable<FamilyMember[]>(data);
