<script lang="ts">
  import FamilyIcon from "$lib/components/svg/FamilyIcon.svelte";

  import SignIn from "$lib/components/SignIn.svelte";

  let showMenu = false;

  function toggleMenu() {
    showMenu = !showMenu;
  }

  function closeMenu() {
    showMenu = false;
  }
</script>

<div class="navbar bg-base-100 border-b-2">
  <div class="navbar-start">
    <a class="btn btn-ghost text-xl" href="/">
      <img
        class="w-10 h-10 rounded-full"
        src="/family-tree-logo.jpeg"
        alt="Family Tree Logo"
      />
    </a>
  </div>

  <div class="navbar-center z-30">
    <h1 class="text-3xl font-bold font-serif">Family Tree</h1>
  </div>
  <div class="navbar-end">
    <SignIn />
  </div>
</div>
