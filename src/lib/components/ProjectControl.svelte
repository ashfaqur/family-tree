<script lang="ts">
  import { user, db } from "$lib/firebase";
  import EditIcon from "$lib/components/svg/EditIcon.svelte";
  import CreateIcon from "$lib/components/svg/CreateIcon.svelte";
  import SaveIcon from "$lib/components/svg/SaveIcon.svelte";

  export let projects: string[] = ["Default", "New"];
</script>

{#if $user}
  <div class="flex flex-row justify-start items-center space-x-1 bg-base-100">
    <h2>Projects:</h2>
    <div class="dropdown">
      <div tabindex="0" role="button" class="btn m-1">
        {projects ? projects[0] : ""}
      </div>
      <ul
        tabindex="0"
        class="dropdown-content menu bg-base-100 rounded-box z-[1] w-52 p-2 shadow"
      >
        <li><a>Item 1</a></li>
        <li><a>Item 2</a></li>
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
