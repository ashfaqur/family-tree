<script lang="ts">
  // import data from "./initialdata.json";
  import data from "$lib/data/private.json";
  import Chart from "$lib/components/Chart.svelte";
  import SignIn from "$lib/components/SignIn.svelte";
</script>

<div class="flex flex-col h-screen bg-[#3b5560]">
  <SignIn />

  <div class="h-full w-auto">
    <Chart {data} />
  </div>
</div>
