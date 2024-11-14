<script lang="ts">
  import { auth, user } from "$lib/firebase";
  import {
    GoogleAuthProvider,
    signInWithPopup,
    signInWithRedirect,
    getRedirectResult,
    signOut,
  } from "firebase/auth";
  import { saveUser } from "$lib/familydata";
  import { onMount } from "svelte";
  import GoogleIcon from "$lib/components/svg/GoogleIcon.svelte";

  // Function to detect mobile browser
  function isMobile() {
    return /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(
      navigator.userAgent
    );
  }

  // Handle sign in
  async function signInWithGoogle() {
    const provider = new GoogleAuthProvider();

    try {
      if (isMobile()) {
        // Use redirect method for mobile
        await signInWithRedirect(auth, provider);
      } else {
        // Use popup for desktop
        const result = await signInWithPopup(auth, provider);
        await saveUser(result.user);
      }
    } catch (error) {
      console.error("Auth error:", error);
      alert("Sign in failed. Please try again.");
    }
  }

  // Handle redirect result on component mount
  onMount(async () => {
    try {
      const result = await getRedirectResult(auth);
      if (result?.user) {
        await saveUser(result.user);
      }
    } catch (error) {
      console.error("Redirect result error:", error);
    }
  });
</script>

<div class="flex justify-end ml-3 mr-1">
  {#if $user}
    <button
      class="btn btn-warning min-h-10 h-10 min-w-28"
      on:click={() => signOut(auth)}
      ><div class="w-4 h-4 fill-blue-400">
        <GoogleIcon />
      </div>
      Sign out</button
    >
  {:else}
    <button
      class="btn btn-primary min-h-10 h-10 min-w-28"
      on:click={signInWithGoogle}
      ><div class="w-4 h-4 fill-blue-400">
        <GoogleIcon />
      </div>
      Sign In</button
    >
  {/if}
</div>
