<script lang="ts">
  import { user } from "$lib/firebase";
  import { selectedProject, chartData } from "$lib/familydata";
  import EditIcon from "$lib/components/svg/EditIcon.svelte";
  import CreateIcon from "$lib/components/svg/CreateIcon.svelte";
  import SaveIcon from "$lib/components/svg/SaveIcon.svelte";
  import EditProject from "$lib/components/EditProject.svelte";
  import SaveProjectDialog from "$lib/components/SaveProjectDialog.svelte";
  import data from "$lib/data/data.json";
  import {
    setUserSelectedProjectId,
    getUserSelectedProjectId,
    getProjectData,
    getUserProjects,
    createProject,
    updateProject,
    delteProject,
  } from "$lib/familydata";
  import type { ProjectData, ProjectFormData } from "$lib/types/types";

  export let projects: ProjectData[] = [];

  let dropdownElement: HTMLElement;
  let showModal = false;
  let showSaveModel = false;
  let editMode = false;
  let formData: ProjectFormData = {
    name: "",
  };

  $: if ($selectedProject) {
    formData = {
      name: $selectedProject.name,
    };
  }
  $: if ($user) {
    // If user signs in then show load user projects
    setupProjects();
  } else {
    // Otherwise load default demo data
    chartData.set(data);
  }

  function openForm(edit: boolean) {
    editMode = edit;
    showModal = true;
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

  async function setupProjects() {
    if ($user) {
      const userProjects = await getUserProjects($user.email);
      if (userProjects.length > 0) {
        const userSelectedProjectUid = await getUserSelectedProjectId(
          $user.uid
        );
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
      } else {
        setSelectedProject(null);
      }
    }
  }

  async function handleSubmitAction(formData: ProjectFormData) {
    console.log("Handle submit action");
    if (!$user) {
      return;
    }
    console.log("Form data:", formData);
    try {
      let projectData: ProjectData;
      if (editMode) {
        projectData = {
          ...$selectedProject,
          name: formData.name,
          members: $chartData,
        };
        console.log("Updated project data:", projectData);
        updateProject(projectData);
      } else {
        projectData = {
          name: formData.name,
          owner: $user.uid,
          viewers: [$user.email],
          members: data,
        };
        createProject(projectData);
        console.log("Newly created project data:", projectData);
      }
      setUserSelectedProjectId($user.uid, projectData.uid);
      setupProjects();
    } catch (error) {
      console.error("Error creating project:", error);
      throw error;
    }
  }

  async function handleDeleteAction() {
    console.log("Delete project action");
    if ($user && $selectedProject) {
      delteProject($selectedProject.uid);
      setupProjects();
    }
  }

  async function saveProjectAction() {
    console.log("Save project action");
    if ($selectedProject) {
      const projectData: ProjectData = {
        ...$selectedProject,
        members: $chartData,
      };
      updateProject(projectData);
    } else {
      console.error("Save project action ignored. No project selected");
    }
  }

  async function setSelectedProject(item: ProjectData) {
    selectedProject.set(item);
    if (item) {
      setUserSelectedProjectId($user.uid, item.uid);
      let project: ProjectData = await getProjectData(item.uid);
      if (project) {
        chartData.set(project.members);
      } else {
        chartData.set(data);
      }
    } else {
      chartData.set(data);
    }
  }
</script>

{#if $user}
  <div class="flex flex-row justify-start items-center space-x-1 bg-base-100">
    <h2 class="ml-1">Project:</h2>
    <div class="dropdown" bind:this={dropdownElement}>
      <div
        tabindex="0"
        role="button"
        class="btn m-1 min-w-28 flex justify-start hover:bg-base-200"
      >
        {$selectedProject ? $selectedProject.name : "None"}
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
    editProject={editMode}
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
