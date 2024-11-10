<script lang="ts">
  import Chart from "$lib/components/Chart.svelte";
  import Nav from "$lib/components/Nav.svelte";
  import ProjectControl from "$lib/components/ProjectControl.svelte";
</script>

<div class="flex flex-col min-w-80 h-screen bg-[#3b5560]">
  <Nav />
  <ProjectControl />
  <div class="h-full w-auto">
    <Chart />
  </div>
</div>
