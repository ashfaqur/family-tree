<script lang="ts">
  import { auth, user, db } from "$lib/firebase";
  import { GoogleAuthProvider, signInWithPopup, signOut } from "firebase/auth";
  import { setDoc, doc } from "firebase/firestore";

  async function signInWithGoogle() {
    const provider = new GoogleAuthProvider();
    const result = await signInWithPopup(auth, provider);
    const user = result.user;

    // Add user to Firestore "users" collection
    await setDoc(doc(db, "users", user.uid), {
      uid: user.uid,
      displayName: user.displayName,
      email: user.email,
      photoURL: user.photoURL,
    });
    console.log(`User ${user.uid} added to Firestore`);
  }
</script>

<div class="flex justify-end mr-1">
  {#if $user}
    <button class="btn btn-warning min-h-10 h-10" on:click={() => signOut(auth)}
      >Sign out</button
    >
  {:else}
    <button class="btn btn-primary min-h-10 h-10" on:click={signInWithGoogle}
      >Sign In</button
    >
  {/if}
</div>
