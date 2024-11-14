<script lang="ts">
  import { auth, user, db } from "$lib/firebase";
  import {
    GoogleAuthProvider,
    signInWithPopup,
    signInWithRedirect,
    getRedirectResult,
    signOut,
  } from "firebase/auth";
  import { getDoc, setDoc, doc } from "firebase/firestore";
  import { onMount } from "svelte";
  import GoogleIcon from "$lib/components/svg/GoogleIcon.svelte";

  // Function to detect mobile browser
  function isMobile() {
    return /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(
      navigator.userAgent
    );
  }

  async function saveUserToFirestore(user: any) {
    const userRef = doc(db, "users", user.uid);
    const userDoc = await getDoc(userRef);

    if (userDoc.exists()) {
      // User exists, update only the necessary fields
      await setDoc(
        userRef,
        {
          uid: user.uid,
          displayName: user.displayName,
          email: user.email,
          photoURL: user.photoURL,
        },
        { merge: true }
      );
      console.log(`User ${user.uid} updated in Firestore`);
    } else {
      // User does not exist, create a new document
      await setDoc(userRef, {
        uid: user.uid,
        displayName: user.displayName,
        email: user.email,
        photoURL: user.photoURL,
      });
      console.log(`User ${user.uid} added to Firestore`);
    }
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
        await saveUserToFirestore(result.user);
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
        await saveUserToFirestore(result.user);
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
