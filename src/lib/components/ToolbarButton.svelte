<script lang="ts">
  export let buttonAction: () => void = () => {};
</script>

<button class="btn min-h-10 h-10" on:click={buttonAction}
  ><div class="w-4 h-4 md:w-6 md:h-6"><slot /></div>
</button>
