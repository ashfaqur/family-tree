<script lang="ts">
  import { user, db } from "$lib/firebase";
  import EditIcon from "$lib/components/svg/EditIcon.svelte";
  import CreateIcon from "$lib/components/svg/CreateIcon.svelte";
  import SaveIcon from "$lib/components/svg/SaveIcon.svelte";

  let showMenu = true;
</script>

{#if $user}
  <div class="flex flex-row justify-start items-center space-x-1 bg-base-100">
    <ul class="menu menu-horizontal px-1">
      <li>
        <details class="min-w-36 w-52 z-30 border rounded-lg">
          <summary>Parent</summary>
          {#if showMenu}
            <ul class="p-2">
              <li class="w-52"><a>Submenu 1</a></li>
              <li class="w-52"><a>Submenu 2</a></li>
            </ul>
          {/if}
        </details>
      </li>
    </ul>
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
