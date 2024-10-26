<script lang="ts">
  export let gender: string = "M";
</script>

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
        bind:group={gender}
        class="radio radio-primary"
      />
      <span class="label-text ml-2">Male</span>
    </label>
    <label class="label cursor-pointer">
      <input
        type="radio"
        name="gender"
        value="F"
        bind:group={gender}
        class="radio radio-primary"
      />
      <span class="label-text ml-2">Female</span>
    </label>
  </div>
</div>
