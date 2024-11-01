<script lang="ts">
  import data from "./initialdata.json";
  import Chart from "$lib/components/Chart.svelte";
</script>

<div class="flex flex-col justify-center align-center h-screen bg-blue-100">
  <h2>Nav</h2>
  <div class="h-full w-auto">
    <Chart {data} />
  </div>
</div>
