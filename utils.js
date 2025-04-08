export const $ = (selector) => document.querySelector(selector);

export const $$ = (selector) => document.querySelectorAll(selector);

export const bindRangeSliderWithSpan = ($rangeSlider, $rangeSliderText) => {
  $rangeSlider.addEventListener("input", (evt) => {
    const value = parseInt(evt.target.value, 10);
    const max = parseInt(evt.target.max, 10);
    const min = parseInt(evt.target.min, 10);

    $rangeSliderText.textContent = value;

    const percentage = ((value - min) / (max - min)) * 100;

    // Set the background to show the used part
    evt.target.style.background = `linear-gradient(to right, #b9fdb6 ${percentage}%, #18171f ${percentage}%)`;
  });

  // Initialize the slider with the correct background
  $rangeSlider.dispatchEvent(new Event("input"));
};

export const copyToClipboard = ($input, callback) => {
  const value = $input.value || "";

  navigator.clipboard
    .writeText(value)
    .then(() => callback?.())
    .catch((err) => alert("Failed to copy text: " + err));
};

const getRandomCharacter = (possibleCharacters) => {
  const randomIndex = Math.floor(Math.random() * possibleCharacters.length);

  return possibleCharacters[randomIndex];
};

export const generatePassword = (length, options) => {
  const uppercaseLetters = "ABCDEFGHIJKLMNÑOPQRSTUVWXYZÑ";
  const lowercaseLetters = "abcdefghijklmnñopqrstuvwxyz";
  const numbers = "0123456789";
  const symbols = '!@#$%^&*(),.?":{}|<>';

  let possibleCharacters = "";

  if (options.includeUppercase) {
    possibleCharacters += uppercaseLetters;
  }
  if (options.includeLowercase) {
    possibleCharacters += lowercaseLetters;
  }
  if (options.includeNumbers) {
    possibleCharacters += numbers;
  }
  if (options.includeSymbols) {
    possibleCharacters += symbols;
  }

  if (possibleCharacters === "") {
    throw new Error("At least one character type must be selected");
  }

  // Generate the password
  let password = "";

  for (let i = 0; i < length; i++) {
    password += getRandomCharacter(possibleCharacters);
  }

  return password;
};

/*
Categories
--------------------------
Weak:
- Length is less than 8 characters.
- Contains fewer than 2 character types (e.g., only lowercase letters or only numbers).
- Contains easily guessable patterns like 12345, password, or qwerty.

Medium:
- Length between 8 and 12 characters.
- Contains at least 2 different character types (e.g., lowercase + numbers).
- Somewhat predictable patterns (e.g., abcd1234).

Strong:
- Length greater than 12 characters.
- Includes a mix of uppercase, lowercase, numbers, and symbols.
- No obvious patterns and appears random.

Very Strong:
- Length greater than 16 characters.
- Includes all four character types (uppercase, lowercase, numbers, and symbols).
- No obvious patterns or easily guessable sequences.
 */
export const evaluatePassword = (password) => {
  const length = password.length;

  // Check for different character types
  const hasUppercase = /[A-ZÑ]/.test(password);
  const hasLowercase = /[a-zñ]/.test(password);
  const hasNumbers = /[0-9]/.test(password);
  const hasSymbols = /[!@#$%^&*(),.?":{}|<>]/.test(password);

  // Calculate character diversity
  const characterTypes = [
    hasUppercase,
    hasLowercase,
    hasNumbers,
    hasSymbols,
  ].filter(Boolean).length;

  // Weak password: length less than 8 or few character types
  if (
    length < 8 ||
    characterTypes < 2 ||
    /password|000000|12345|qwerty|letmein/i.test(password)
  ) {
    return { category: "Weak", columns: 1 };
  }

  // Medium password: length between 8 and 12, some character diversity
  if (length >= 8 && length <= 12 && characterTypes >= 2) {
    return { category: "Medium", columns: 2 };
  }

  // Strong password: length greater than 12 and high diversity
  if (length > 12 && length <= 15 && characterTypes === 4) {
    return { category: "Strong", columns: 3 };
  }

  // Very Strong password: length greater than 16 and high diversity
  if (length > 16 && characterTypes === 4) {
    return { category: "Very Strong", columns: 4 };
  }

  // If none of the above conditions are met, categorize as Medium
  return { category: "Medium", columns: 2 };
};
