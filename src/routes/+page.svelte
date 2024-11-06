<script lang="ts">
  import data from "$lib/data/initialdata.json";
  // import data from "$lib/data/private.json";
  import Chart from "$lib/components/Chart.svelte";
  import Nav from "$lib/components/Nav.svelte";
  import ProjectControl from "$lib/components/ProjectControl.svelte";
</script>

<div class="flex flex-col min-w-96 h-screen bg-[#3b5560]">
  <Nav />
  <ProjectControl />
  <div class="h-full w-auto">
    <Chart {data} />
  </div>
</div>
