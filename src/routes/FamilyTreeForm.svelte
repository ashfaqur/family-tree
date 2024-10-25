<script lang="ts">
  import type { FamilyMember } from "$lib/types/types";

  export let familyMember: FamilyMember | null;
  export let postSubmit: (props?: { delete?: boolean }) => void;
  export let showModal = false;
  export let closeModal = () => {};

  let formData = {
    firstname: familyMember?.data?.firstname || "",
    lastname: familyMember?.data?.lastname || "",
    birthday: familyMember?.data?.birthday || "",
    avatar:
      familyMember?.data?.avatar ||
      "https://static8.depositphotos.com/1009634/988/v/950/depositphotos_9883921-stock-illustration-no-user-profile-picture.jpg",
    gender: familyMember?.data?.gender || "M",
  };

  function handleSubmit() {
    if (familyMember) {
      familyMember.data = { ...familyMember.data, ...formData };
      showModal = false;
      postSubmit();
      closeModal();
    }
  }

  function handleDelete() {
    showModal = false;
    postSubmit({ delete: true });
    closeModal();
  }

  function handleClose() {
    showModal = false;
    closeModal();
  }
</script>

{#if showModal}
  <div class="modal modal-open">
    <div class="modal-box relative max-w-xl">
      <!-- Close button -->
      <button
        class="btn btn-sm btn-circle absolute right-2 top-2"
        on:click={handleClose}
      >
        ✕
      </button>

      <form on:submit|preventDefault={handleSubmit} class="space-y-6">
        <div class="flex justify-between items-center">
          <h3 class="font-bold text-lg">Edit Family Member</h3>
          {#if familyMember && !familyMember.to_add}
            <button
              type="button"
              class="btn btn-error btn-sm"
              on:click={handleDelete}
            >
              Delete
            </button>
          {/if}
        </div>

        <!-- Gender Selection -->
        <div class="form-control">
          <label class="label">
            <span class="label-text font-medium">Gender</span>
          </label>
          <div class="flex gap-4">
            <label class="label cursor-pointer">
              <input
                type="radio"
                name="gender"
                value="M"
                bind:group={formData.gender}
                class="radio radio-primary"
              />
              <span class="label-text ml-2">Male</span>
            </label>
            <label class="label cursor-pointer">
              <input
                type="radio"
                name="gender"
                value="F"
                bind:group={formData.gender}
                class="radio radio-primary"
              />
              <span class="label-text ml-2">Female</span>
            </label>
          </div>
        </div>

        <!-- First Name -->
        <div class="form-control">
          <label class="label" for="firstname">
            <span class="label-text font-medium">First Name</span>
          </label>
          <input
            type="text"
            id="firstname"
            bind:value={formData.firstname}
            placeholder="Enter first name"
            class="input input-bordered w-full"
          />
        </div>

        <!-- Last Name -->
        <div class="form-control">
          <label class="label" for="lastname">
            <span class="label-text font-medium">Last Name</span>
          </label>
          <input
            type="text"
            id="lastname"
            bind:value={formData.lastname}
            placeholder="Enter last name"
            class="input input-bordered w-full"
          />
        </div>

        <!-- Birthday -->
        <div class="form-control">
          <label class="label" for="birthday">
            <span class="label-text font-medium">Birthday</span>
          </label>
          <input
            type="text"
            id="birthday"
            bind:value={formData.birthday}
            placeholder="Enter birthday"
            class="input input-bordered w-full"
          />
        </div>

        <!-- Avatar URL -->
        <div class="form-control">
          <label class="label" for="avatar">
            <span class="label-text font-medium">Avatar URL</span>
          </label>
          <input
            type="text"
            id="avatar"
            bind:value={formData.avatar}
            placeholder="Enter avatar URL"
            class="input input-bordered w-full"
          />
        </div>

        <!-- Preview of current avatar -->
        <div class="form-control">
          <label class="label">
            <span class="label-text font-medium">Avatar Preview</span>
          </label>
          <div class="avatar">
            <div class="w-24 rounded">
              <img src={formData.avatar} alt="Avatar preview" />
            </div>
          </div>
        </div>

        <!-- Form Actions -->
        <div class="modal-action">
          <button type="button" class="btn btn-ghost" on:click={handleClose}>
            Cancel
          </button>
          <button type="submit" class="btn btn-primary"> Save </button>
        </div>
      </form>
    </div>

    <!-- Modal backdrop -->
    <div
      class="modal-backdrop bg-neutral bg-opacity-50"
      on:click|self={handleClose}
    />
  </div>
{/if}
