<script lang="ts">
  import FormTextInput from "$lib/components/FormTextInput.svelte";
  import { selectedProject } from "$lib/familydata";
  import type { ProjectFormData } from "$lib/types/types";
  import { chartData } from "$lib/familydata";

  export let showModal = false;
  export let editProject = false;

  function handleClose() {
    showModal = false;
  }

  function handleSubmit() {
    showModal = false;
    const projectName = formData.name;
    const currentChartData = $chartData;
    console.log("Project name: ", projectName);
    console.log("Chart data:");
    console.log(currentChartData);
  }

  function handleDelete() {
    showModal = false;
  }

  let formData: ProjectFormData = {
    name: editProject ? $selectedProject : null,
  };

  function resetFormData() {
    formData = {
      name: editProject ? $selectedProject : null,
    };
  }
</script>

{#if showModal}
  {resetFormData()}
  <div class="modal modal-open">
    <div class="modal-box relative max-w-xl">
      <!-- Close button -->
      <button
        class="btn btn-sm btn-circle absolute right-2 top-2"
        on:click={handleClose}
      >
        ✕
      </button>

      <form on:submit|preventDefault={handleSubmit} class="space-y-6">
        <h3 class="font-bold text-lg">
          {editProject ? "Edit" : "Add"} Project
        </h3>

        <!-- Project Name Input -->
        <FormTextInput
          id="name"
          label="Project Name"
          placeholder="Enter project name"
          bind:value={formData.name}
          validateMaxLength={true}
          validateTextAllowedAlphabet={true}
        />

        <div class="flex justify-between items-center">
          {#if editProject}
            <button
              type="button"
              class="btn btn-error btn-sm"
              on:click={handleDelete}
            >
              Delete
            </button>
          {/if}
          <div class="modal-action">
            <button type="button" class="btn btn-ghost" on:click={handleClose}>
              Cancel
            </button>
            <button type="submit" class="btn btn-primary"> Save </button>
          </div>
        </div>
      </form>
    </div>

    <!-- Modal backdrop -->
    <div
      class="modal-backdrop bg-neutral bg-opacity-50"
      on:click|self={handleClose}
    />
  </div>
{/if}
