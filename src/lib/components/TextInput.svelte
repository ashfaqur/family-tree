<script lang="ts">
  import {
    validateTextAlphabetCharacters,
    validateTextDate,
    validateTextLength,
  } from "$lib/validationUtil";

  export let id: string;
  export let placeholder: string;
  export let value: string;
  export let maxLength: number = 10;

  export let validateMaxLength: boolean = false;
  export let validateTextAllowedAlphabet: boolean = false;
  export let validateDateFormat: boolean = false;

  export let isValid: (result: string) => void;

  let inputValid: boolean = true;
  let validationErrorMessage: string = "";

  function validation(event: Event) {
    const inputValue = (event.target as HTMLInputElement).value;
    const result = validateInput(inputValue);
    inputValid = result ? false : true;
    validationErrorMessage = result || "";
    isValid(result);
  }

  function validateInput(input: string): string {
    let result = "";
    if (validateMaxLength) {
      result = validateTextLength(input, maxLength);
      if (result) {
        return result;
      }
    }
    if (validateTextAllowedAlphabet) {
      result = validateTextAlphabetCharacters(input);
      if (result) {
        return result;
      }
    }
    if (validateDateFormat) {
      result = validateTextDate(input);
      if (result) {
        return result;
      }
    }
    return "";
  }
</script>

<input
  class="input input-bordered rounded-2xl input-info w-full placeholder:italic focus:outline-none focus:border-2 {inputValid
    ? 'input-info'
    : 'input-error'}"
  {id}
  type="text"
  {placeholder}
  bind:value
  on:input={validation}
  autocomplete="off"
  aria-invalid={!inputValid}
  aria-errormessage={validationErrorMessage ? id + "-error" : undefined}
/>
