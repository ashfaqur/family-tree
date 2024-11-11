<script lang="ts">
  import type { ProjectData } from "$lib/types/types";

  export let project: ProjectData;
  export let showModal = false;
  export let saveProjectAction: () => void = () => {};

  function handleSave() {
    showModal = false;
    saveProjectAction();
  }

  function handleClose() {
    showModal = false;
  }
</script>

{#if showModal && project}
  <div class="modal modal-open">
    <div class="modal-box relative max-w-sm">
      <!-- Close button -->
      <button
        class="btn btn-sm btn-circle absolute right-2 top-2"
        on:click={handleClose}
      >
        ✕
      </button>

      <form on:submit|preventDefault={handleSave} class="space-y-6">
        <h3 class="font-bold text-lg">Save Project</h3>
        <h4>Project name: {project.name}</h4>
        <div class="modal-action flex justify-between items-center">
          <button type="button" class="btn btn-ghost" on:click={handleClose}>
            Cancel
          </button>
          <button type="submit" class="btn btn-primary"> Save </button>
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
