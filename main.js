document.addEventListener('DOMContentLoaded', function () {
  const passwordDisplay = document.querySelector('.password-text');
  const lengthSlider = document.getElementById('length-slider');
  const lengthValue = document.querySelector('.character-count');
  const uppercaseCheckbox = document.getElementById('uppercase');
  const lowercaseCheckbox = document.getElementById('lowercase');
  const numbersCheckbox = document.getElementById('numbers');
  const symbolsCheckbox = document.getElementById('symbols');
  const generateButton = document.getElementById('generate-btn');
  const copyButton = document.querySelector('.copy-btn');
  const copiedText = document.querySelector('.copied-text');
  const strengthText = document.getElementById('strength-text');
  const strengthBars = document.querySelectorAll('.bar');
  const errorMessage = document.getElementById('error-message');
  const form = document.getElementById('password-form');

  // Character sets for password generation
  const uppercaseChars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
  const lowercaseChars = 'abcdefghijklmnopqrstuvwxyz';
  const numberChars = '0123456789';
  const symbolChars = '!@#$%^&*()_+-=[]{}|;:,.<>?';

    function updateSliderBackground() {
        const value = lengthSlider.value;
        const max = lengthSlider.max;
        const percentage = (value / max) * 100;
        lengthSlider.style.background = `linear-gradient(to right, #a4ffaf ${percentage}%, #18171f ${percentage}%)`;
    }

    lengthSlider.addEventListener("input", () => {
        lengthValue.textContent = lengthSlider.value;
        updateSliderBackground();
        validateOptions();
    });

  // Add event listeners to checkboxes
  [uppercaseCheckbox, lowercaseCheckbox, numbersCheckbox, symbolsCheckbox].forEach(cb => {
    cb.addEventListener('change', validateOptions);
  });

  // Validate options
  function validateOptions() {
    const isAnyChecked =
      uppercaseCheckbox.checked ||
      lowercaseCheckbox.checked ||
      numbersCheckbox.checked ||
      symbolsCheckbox.checked;

    const isValidLength = parseInt(lengthSlider.value) >= 5;

    if (isAnyChecked && isValidLength) {
      generateButton.disabled = false;
      errorMessage.classList.remove('visible');
    } else {
      generateButton.disabled = true;
      errorMessage.textContent = !isAnyChecked
        ? "Please select at least one character type"
        : "Character length must be at least 5";
      errorMessage.classList.add('visible');

      // Reset display
      passwordDisplay.innerHTML = '<span class="password-placeholder">P4$5W0rD!</span>';
      strengthText.textContent = "NONE";
      strengthText.className = 'strength-label strength-text';
      strengthBars.forEach(bar => bar.className = 'bar');
    }
  }

  // Generate password
  function generatePassword() {
    let length = parseInt(lengthSlider.value);
    let charSet = '';
    let password = '';

    if (uppercaseCheckbox.checked) charSet += uppercaseChars;
    if (lowercaseCheckbox.checked) charSet += lowercaseChars;
    if (numbersCheckbox.checked) charSet += numberChars;
    if (symbolsCheckbox.checked) charSet += symbolChars;

    if (!charSet) return '';

    for (let i = 0; i < length; i++) {
      const randomIndex = Math.floor(Math.random() * charSet.length);
      password += charSet[randomIndex];
    }

    passwordDisplay.innerHTML = password;
    updateStrengthIndicator(password);

    return password;
  }

  // Update strength indicator
  function updateStrengthIndicator(password) {
    let strength = 0;

    if (password.length >= 8) strength++;
    if (password.length >= 12) strength++;
    if (/[A-Z]/.test(password) && /[a-z]/.test(password)) strength++;
    if (/\d/.test(password)) strength++;
    if (/[^A-Za-z0-9]/.test(password)) strength++;

    // Reset Strength bars
    strengthBars.forEach(bar => bar.className = 'bar');

    let strengthLevel = '';
    let strengthClass = '';

    if (strength <= 1) {
      strengthLevel = 'TOO WEAK';
      strengthClass = 'too-weak';
    } else if (strength === 2) {
      strengthLevel = 'WEAK';
      strengthClass = 'weak';
    } else if (strength === 3) {
      strengthLevel = 'MEDIUM';
      strengthClass = 'medium';
    } else {
      strengthLevel = 'STRONG';
      strengthClass = 'strong';
    }

    strengthText.textContent = strengthLevel;
    strengthText.className = 'strength-label strength-text ' + strengthClass;

    // Fill bars according to strength
    for (let i = 0; i < Math.min(strength, 4); i++) {
      strengthBars[i].classList.add('filled', strengthClass);
    }
  }

  // Copy password
  function copyToClipboard() {
    const password = passwordDisplay.textContent;

    if (password && password !== 'P4$5W0rD!') {
      navigator.clipboard.writeText(password).then(() => {
        copiedText.classList.add('visible');
        setTimeout(() => copiedText.classList.remove('visible'), 2000);
      });
    }
  }

  // Events
  form.addEventListener('submit', e => {
    e.preventDefault();
    if (!generateButton.disabled) generatePassword();
  });

  copyButton.addEventListener('click', copyToClipboard);

  // Initial validation
  validateOptions();
});

