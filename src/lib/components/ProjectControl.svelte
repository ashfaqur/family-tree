<script lang="ts">
  import { user, db } from "$lib/firebase";
  import EditIcon from "$lib/components/svg/EditIcon.svelte";
  import CreateIcon from "$lib/components/svg/CreateIcon.svelte";
  import SaveIcon from "$lib/components/svg/SaveIcon.svelte";
  import { onMount } from "svelte";

  export let projects: string[] = ["Default", "New"];
  export let selectedProject: string = "Default";

  let dropdownElement: HTMLElement;

  function selectItem(item: string) {
    selectedProject = item;
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
  <div class="flex flex-row justify-start items-center space-x-1 bg-base-100">
    <h2>Projects:</h2>
    <div class="dropdown" bind:this={dropdownElement}>
      <div
        tabindex="0"
        role="button"
        class="btn m-1 min-w-52 flex justify-start hover:bg-base-200"
      >
        {selectedProject}
      </div>
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
    </div>
    <button class="btn min-h-10 h-10"
      ><div class="w-6 h-6"><SaveIcon /></div>
    </button>
    <button class="btn min-h-10 h-10"
      ><div class="w-6 h-6"><EditIcon /></div>
    </button>
    <button class="btn min-h-10 h-10"
      ><div class="w-6 h-6"><CreateIcon /></div>
    </button>
  </div>
{/if}
