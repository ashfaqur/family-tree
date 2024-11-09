import { writable } from "svelte/store";

// Create a writable store with an initial value of "Default"
export const selectedProject = writable<string>("Default");
