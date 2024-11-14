<script lang="ts">
  import { user, db } from "$lib/firebase";
  import { v4 as uuidv4 } from "uuid";
  import { selectedProject, chartData } from "$lib/familydata";
  import EditIcon from "$lib/components/svg/EditIcon.svelte";
  import CreateIcon from "$lib/components/svg/CreateIcon.svelte";
  import SaveIcon from "$lib/components/svg/SaveIcon.svelte";
  import EditProject from "$lib/components/EditProject.svelte";
  import SaveProjectDialog from "$lib/components/SaveProjectDialog.svelte";
  import data from "$lib/data/initialdata.json";
  import {
    doc,
    getDoc,
    setDoc,
    collection,
    getDocs,
    query,
    where,
    deleteDoc,
  } from "firebase/firestore";
  import type {
    UserData,
    ProjectData,
    ProjectFormData,
  } from "$lib/types/types";

  export let projects: ProjectData[] = [];

  let dropdownElement: HTMLElement;
  let showModal = false;
  let showSaveModel = false;
  let editProject = false;
  let formData: ProjectFormData;

  $: if ($selectedProject) {
    formData = {
      name: $selectedProject.name,
    };
  }
  $: if ($user) {
    setupProjects();
  } else {
    chartData.set(data);
  }

  function openForm(edit: boolean) {
    editProject = edit;
    showModal = true;
  }

  async function handleSubmitAction(formData: ProjectFormData) {
    if ($user) {
      try {
        console.log("Handle submit action");
        console.log(formData);
        let projectData: ProjectData;
        if (editProject) {
          const projectsRef = collection(db, "projects", $selectedProject.uid);
          projectData = {
            ...$selectedProject,
            name: formData.name,
            members: $chartData,
          };
          await setDoc(doc(projectsRef), projectData);
        } else {
          // Generate a Firestore-style ID
          const projectsRef = collection(db, "projects");
          const newProjectRef = doc(projectsRef);
          const projectId = newProjectRef.id; // This gets the auto-generated ID

          projectData = {
            uid: projectId,
            name: formData.name,
            owner: $user.uid,
            viewers: [$user.email],
            members: data,
          };
          // Use the generated ID to create the document
          await setDoc(newProjectRef, projectData);
          const userRef = doc(db, "users", $user.uid);
          await setDoc(userRef, {
            project: projectData.uid,
          });
          setupProjects();
          console.log(`Project ${projectId} created successfully`);
        }
      } catch (error) {
        console.error("Error creating project:", error);
        throw error;
      }
    }
  }

  async function handleDeleteAction() {
    console.log("Delete project");
    if ($user && $selectedProject) {
      const projectUid = $selectedProject.uid;
      console.log("Project UID:", projectUid);
      const projectRef = doc(db, "projects", $selectedProject.uid);
      await deleteDoc(projectRef);
      console.log("Project deleted successfully");
      setupProjects();
    }
  }

  async function saveProjectAction() {
    if ($selectedProject) {
      const projectRef = doc(db, "projects", $selectedProject.uid);
      const projectData: ProjectData = {
        ...$selectedProject,
        members: $chartData,
      };
      await setDoc(projectRef, projectData);
    }
  }

  function saveProject() {
    if (!$selectedProject) {
      openForm(false);
    } else {
      showSaveModel = true;
    }
  }

  async function selectItem(item: ProjectData) {
    if ($user) {
      // Close the dropdown by removing the focus
      if (dropdownElement) {
        const activeElement = document.activeElement as HTMLElement;
        if (activeElement) {
          activeElement.blur();
        }
        dropdownElement.blur();
      }
      setSelectedProject(item);
    }
  }

  async function setSelectedProject(item: ProjectData) {
    selectedProject.set(item);
    if (item) {
      console.log("Selected project id:", item.uid);
      const userRef = doc(db, "users", $user.uid);
      await setDoc(userRef, {
        project: item.uid,
      });
      let project: ProjectData = await getProjectData(item.uid);
      if (project) {
        chartData.set(project.members);
      }
    } else {
      chartData.set(data);
    }
  }

  async function setupProjects() {
    if ($user) {
      const userProjects = await getUserProjects();
      if (userProjects.length > 0) {
        const userSelectedProjectUid = await getUserDefaultProjectUid();
        projects = userProjects;
        if (userSelectedProjectUid) {
          const selectedProjectItem = projects.find(
            (project) => project.uid === userSelectedProjectUid
          );
          if (selectedProjectItem) {
            setSelectedProject(selectedProjectItem);
          } else {
            setSelectedProject(projects[0]);
          }
        } else {
          setSelectedProject(projects[0]);
        }
      }
    }
  }

  async function getUserDefaultProjectUid(): Promise<string> {
    console.log("getUserDefaultProject");
    let userProject: string = null;
    const userDoc = await getDoc(doc(db, "users", $user.uid));
    if (userDoc.exists()) {
      const userData: UserData = userDoc.data();
      console.log("User document:", userData);
      if (userData) {
        console.log("User project:", userData.project);
        userProject = userData.project;
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

  async function getProjectData(projectUid: string): Promise<ProjectData> {
    const projectRef = doc(db, "projects", projectUid);
    const projectDoc = await getDoc(projectRef);
    if (projectDoc.exists()) {
      const projectData: ProjectData = projectDoc.data();
      return projectData;
    }
    return null;
  }
</script>

{#if $user}
  <div class="flex flex-row justify-start items-center space-x-1 bg-base-100">
    <h2>Projects:</h2>
    <div class="dropdown" bind:this={dropdownElement}>
      <div
        tabindex="0"
        role="button"
        class="btn m-1 min-w-52 flex justify-start hover:bg-base-200"
      >
        {$selectedProject ? $selectedProject.name : "Default"}
      </div>
      {#if projects && projects.length > 0}
        <ul
          tabindex="0"
          class="dropdown-content menu bg-base-100 rounded-box z-30 w-52 p-2 shadow"
        >
          {#each projects as item}
            <li>
              <a on:click|preventDefault={() => selectItem(item)}>{item.name}</a
              >
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

  <EditProject
    {formData}
    {editProject}
    bind:showModal
    {handleSubmitAction}
    {handleDeleteAction}
  />

  <SaveProjectDialog
    project={$selectedProject}
    bind:showModal={showSaveModel}
    {saveProjectAction}
  />
{/if}
