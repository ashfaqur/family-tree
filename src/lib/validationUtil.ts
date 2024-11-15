/**
 * Validates the length of a given text input against a specified maximum length.
 *
 * @param {string} text - The text input to be validated.
 * @param {number} maxLength - The maximum allowed length of the text input.
 * @returns {string} - An empty string if the input is valid, otherwise an error message.
 */
export function validateTextLength(text: string, maxLength: number): string {
  return text.length > maxLength ? `Max length is ${maxLength} characters` : "";
}

/**
 * Validates that the given text input contains only alphabetical characters.
 *
 * This function uses a regular expression to ensure that the input text consists
 * solely of English and German alphabetical characters, including umlauts and ß.
 *
 * @param {string} text - The text input to be validated.
 * @returns {string} - An empty string if the input is valid, otherwise an error message
 * indicating that only alphabetical characters are allowed.
 */
export function validateTextAlphabetCharacters(text: string): string {
  // Regular expression to match English and German alphabetical characters (including umlauts and ß)
  const alphabetRegex = /^[A-Za-zÄäÖöÜüß]*$/;
  return !alphabetRegex.test(text)
    ? "Only alphabetical characters are allowed."
    : "";
}

/**
 * Validates a given text input against a date format.
 *
 * The function checks against the following date formats:
 * - YEAR (e.g. 2024)
 * - MONTH/YEAR (e.g. 12/2024)
 * - DAY/MONTH/YEAR (e.g. 31/12/2024)
 *
 * If the input is valid, an empty string is returned. Otherwise, an error message
 * is returned describing the validation error.
 *
 * @param {string} text - The text input to be validated.
 * @returns {string} - An empty string if the input is valid, otherwise an error message.
 */
export function validateTextDate(text: string): string {
  const yearRegex = /^\d{4}$/; // Matches only "YEAR"
  const monthYearRegex = /^(0?[1-9]|1[0-2])\/\d{4}$/; // Matches "MONTH/YEAR"
  const fullDateRegex = /^(0?[1-9]|[12]\d|3[01])\/(0?[1-9]|1[0-2])\/\d{4}$/; // Matches "DAY/MONTH/YEAR"

  // Check format and parse components
  let day: number;
  let month: number;
  let year: number;

  if (yearRegex.test(text)) {
    // Format: YEAR
    year = parseInt(text, 10);
  } else if (monthYearRegex.test(text)) {
    // Format: MONTH/YEAR
    [month, year] = text.split("/").map(Number);
  } else if (fullDateRegex.test(text)) {
    // Format: DAY/MONTH/YEAR
    [day, month, year] = text.split("/").map(Number);
  } else {
    return "Date format is DD/MM/YYYY";
  }

  const currentYear = new Date().getFullYear();

  // Validate the year
  if (year < 1000 || year > currentYear) {
    return "Year must be a valid four-digit number.";
  }

  // Validate the month if present
  if (month && (month < 1 || month > 12)) {
    return "Month must be between 1 and 12.";
  }

  // Validate the day if present
  if (day) {
    const maxDays = new Date(year, month, 0).getDate(); // Number of days in the given month
    if (day < 1 || day > maxDays) {
      return `Day must be between 1 and ${maxDays} for the month ${month}.`;
    }
  }

  return ""; // Return an empty string if the date is valid
}
