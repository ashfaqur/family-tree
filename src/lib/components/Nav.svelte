<script lang="ts">
  import SignIn from "$lib/components/SignIn.svelte";
</script>

<div class="navbar bg-base-100 border-b-2">
  <!-- Left side -->
  <div class="navbar-start">
    <a class="btn btn-ghost text-xl" href="/">
      <img
        class="w-10 h-10 rounded-full"
        src="/family-tree-logo.jpeg"
        alt="Family Tree Logo"
      />
    </a>
  </div>

  <!-- Middle -->
  <div class="navbar-center z-30">
    <h1 class="text-3xl font-bold font-serif">Family Tree</h1>
  </div>

  <!-- Right side -->
  <div class="navbar-end">
    <SignIn />
  </div>
</div>
