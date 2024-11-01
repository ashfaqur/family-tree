<script lang="ts">
  import type { FamilyMember } from "$lib/types/types";

  import FormTextInput from "$lib/components/FormTextInput.svelte";
  import RadioButtonGroup from "$lib/components/RadioButtonGroup.svelte";

  export let familyMember: FamilyMember | null;
  export let postSubmit: (props?: { delete?: boolean }) => void;
  export let showModal = false;
  export let closeModal = () => {};

  let formData = {
    firstname: familyMember?.data?.firstname || "",
    lastname: familyMember?.data?.lastname || "",
    birthday: familyMember?.data?.birthday || "",
    gender: familyMember?.data?.gender || "M",
  };

  function resetFormData() {
    formData = {
      firstname: familyMember?.data?.firstname || "",
      lastname: familyMember?.data?.lastname || "",
      birthday: familyMember?.data?.birthday || "",
      gender: familyMember?.data?.gender || "M",
    };
  }

  function handleSubmit() {
    console.log("handleSubmit");
    if (familyMember) {
      console.log("handleSubmit triggered");
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
  {resetFormData()}
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
        <h3 class="font-bold text-lg">Edit Family Member</h3>

        <!-- Gender Selection -->
        <RadioButtonGroup gender={formData.gender} />

        <!-- First Name Input -->
        <FormTextInput
          id="firstname"
          label="First Name"
          placeholder="Enter first name"
          bind:value={formData.firstname}
          validateMaxLength={true}
          validateTextAllowedAlphabet={true}
        />

        <!-- Last Name Input -->
        <FormTextInput
          id="lastname"
          label="Last Name"
          placeholder="Enter last name"
          bind:value={formData.lastname}
          validateMaxLength={true}
          validateTextAllowedAlphabet={true}
        />

        <!-- Birthday Input -->
        <FormTextInput
          id="birthday"
          label="Birthday"
          placeholder="DD/MM/YYYY"
          bind:value={formData.birthday}
          validateDateFormat={true}
        />
        <div class="flex justify-between items-center">
          {#if familyMember}
            <button
              type="button"
              class="btn btn-error btn-sm"
              on:click={handleDelete}
            >
              Delete
            </button>
          {/if}
          <div class="modal-action">
            <button type="button" class="btn btn-ghost" on:click={handleClose}>
              Cancel
            </button>
            <button type="submit" class="btn btn-primary"> Save </button>
          </div>
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
