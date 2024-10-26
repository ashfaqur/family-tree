<script lang="ts">
  import TextInput from "./TextInput.svelte";
  import { fade } from "svelte/transition";

  export let id: string;
  export let label: string;
  export let placeholder: string = "";
  export let value: string = "";
  export let valid: boolean = true;

  export let validateMaxLength: boolean = false;
  export let validateTextAllowedAlphabet: boolean = false;
  export let validateDateFormat: boolean = false;

  let invalidMsg: string = "";
</script>

<div class="form-control">
  <label class="label" for={id}>
    <span class="label-text font-medium">{label}</span>
  </label>
  <TextInput
    {id}
    {placeholder}
    bind:value
    isValid={(result) => {
      if (result) {
        valid = false;
        invalidMsg = result;
        console.log(result);
      } else {
        valid = true;
        invalidMsg = "";
      }
    }}
    {validateDateFormat}
    {validateMaxLength}
    {validateTextAllowedAlphabet}
  />
  {#if !valid}
    <div transition:fade={{ duration: 300 }}>
      <h2>{invalidMsg}</h2>
    </div>
  {/if}
</div>
