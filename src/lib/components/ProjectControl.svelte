<script lang="ts">
  import { user, db } from "$lib/firebase";
  import EditIcon from "$lib/components/svg/EditIcon.svelte";
  import CreateIcon from "$lib/components/svg/CreateIcon.svelte";
  import SaveIcon from "$lib/components/svg/SaveIcon.svelte";
  import EditProject from "$lib/components/EditProject.svelte";
  import {
    doc,
    getDoc,
    collection,
    getDocs,
    query,
    where,
  } from "firebase/firestore";
  import type { UserData, ProjectData } from "$lib/types/types";
  import { selectedProject } from "$lib/familydata";

  export let projects: string[] = [];

  let dropdownElement: HTMLElement;
  let showModal = false;
  let editProject = false;

  function openForm(edit: boolean) {
    editProject = edit;
    showModal = true;
  }

  function saveProject() {
    if (!$selectedProject) {
      openForm(false);
    }
  }

  $: if ($user) {
    setupProjects();
  }

  async function setupProjects() {
    if ($user) {
      const userProjects = await getUserProjects();
      if (userProjects.length > 0) {
        const userSelectedProject = await getUserDefaultProject();
        projects = userProjects.map((project) => project.name);
        if (userSelectedProject && projects.includes(userSelectedProject)) {
          selectedProject.set(userSelectedProject);
        }
      }
    }
  }

  async function getUserDefaultProject() {
    console.log("getUserDefaultProject");
    let userProject = null;
    const userDoc = await getDoc(doc(db, "users", $user.uid));
    if (userDoc.exists()) {
      const userData: UserData = userDoc.data();
      console.log("User document:", userData);
      if (userData) {
        console.log("User project:", userData.project);
        return userData.project;
      } else {
        console.log("No project property found in user document");
      }
    }
    return userProject;
  }

  async function getUserProjects(): Promise<ProjectData[]> {
    let userProjects: ProjectData[] = [];
    const userEmail = $user.email;
    const projectsRef = collection(db, "projects");
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
      // Do something with the retrieved projects
    } else {
      console.log("No projects found containing user email");
    }
    return userProjects;
  }

  function selectItem(item: string) {
    selectedProject.set(item);
    // Close the dropdown by removing the focus
    if (dropdownElement) {
      const activeElement = document.activeElement as HTMLElement;
      if (activeElement) {
        activeElement.blur();
      }
      dropdownElement.blur();
    }
  }
</script>

{#if $user}
  <!-- {getUserDefaultProject()} -->
  <div class="flex flex-row justify-start items-center space-x-1 bg-base-100">
    <h2>Projects:</h2>
    <div class="dropdown" bind:this={dropdownElement}>
      <div
        tabindex="0"
        role="button"
        class="btn m-1 min-w-52 flex justify-start hover:bg-base-200"
      >
        {$selectedProject ? $selectedProject : "Default"}
      </div>
      {#if projects && projects.length > 0}
        <ul
          tabindex="0"
          class="dropdown-content menu bg-base-100 rounded-box z-30 w-52 p-2 shadow"
        >
          {#each projects as item}
            <li>
              <a on:click|preventDefault={() => selectItem(item)}>{item}</a>
            </li>
          {/each}
        </ul>
      {/if}
    </div>
    <button class="btn min-h-10 h-10" on:click={() => saveProject()}
      ><div class="w-6 h-6"><SaveIcon /></div>
    </button>
    <button class="btn min-h-10 h-10" on:click={() => openForm(true)}
      ><div class="w-6 h-6"><EditIcon /></div>
    </button>
    <button class="btn min-h-10 h-10" on:click={() => openForm(false)}
      ><div class="w-6 h-6"><CreateIcon /></div>
    </button>
  </div>

  <EditProject bind:showModal />
{/if}
