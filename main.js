import {
  $,
  $$,
  evaluatePassword,
  generatePassword,
  copyToClipboard,
  bindRangeSliderWithSpan,
} from "./utils.js";

(async () => {
  const $rangeSlider = $("#generator-range-slider");
  const $sliderValueText = $("#range-value-text");
  const $inputPasswordGenerate = $("#paswword-generate");
  const $btnCopyPassword = $("#copy-password");
  const $btnGeneratePassword = $("#generate-password");
  const $listCheckboxWrapper = $(".password-generator--checkboxes");
  const $strengthCategory = $(".strength__text");
  const $copyPasswordCopied = $("#copy-password--copied");
  const $$strengthBar = $$(".strength__bar--list span");

  const initializeInputs = () => {
    $inputPasswordGenerate.value = "";
    $strengthCategory.innerText = "";
    $copyPasswordCopied.style.visibility = "hidden";

    for (let i = 0; i < $$strengthBar.length; i++) {
      $$strengthBar[i].classList.remove("filled");
    }
  };

  const showCopiedText = async () => {
    $copyPasswordCopied.style.visibility = "visible";

    setTimeout(() => {
      $copyPasswordCopied.style.visibility = "hidden";
    }, 3000);
  };

  bindRangeSliderWithSpan($rangeSlider, $sliderValueText);

  $btnCopyPassword.addEventListener("click", (evt) => {
    if ($inputPasswordGenerate.value.trim() === "") return false;

    copyToClipboard($inputPasswordGenerate, showCopiedText);
  });

  $btnGeneratePassword.addEventListener("click", (evt) => {
    initializeInputs();

    const listCheckboxes = $listCheckboxWrapper.querySelectorAll(
      'input[type="checkbox"]:checked'
    );
    const length = parseInt($rangeSlider.value || "0", 10);
    const options = {};

    if (listCheckboxes.length === 0) {
      alert("At least one checkbox must be selected");

      return;
    }

    for (let i = 0; i < listCheckboxes.length; i++) {
      options[listCheckboxes[i].value] = true;
    }

    const password = generatePassword(length, options);
    const { category, columns } = evaluatePassword(password);

    $inputPasswordGenerate.value = password;
    $strengthCategory.innerText = category;

    for (let i = 0; i < columns; i++) {
      $$strengthBar[i].classList.add("filled");
    }
  });

  initializeInputs();
})();
