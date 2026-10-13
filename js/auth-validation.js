
document.addEventListener("DOMContentLoaded", function () {
    const registerForm = document.getElementById("registerForm");

    if (!registerForm) {
        return;
    }

    const nameInput = document.getElementById("registerName");
    const emailInput = document.getElementById("registerEmail");
    const passwordInput = document.getElementById("registerPassword");
    const messageBox = document.getElementById("registerMessage");
    const submitButton = registerForm.querySelector(
        'button[type="submit"]'
    );

    const namePattern = /^[A-Za-z]+(?:[ '-][A-Za-z]+)*$/;
    const emailPattern =
        /^[A-Za-z0-9](?:[A-Za-z0-9._%+-]*[A-Za-z0-9])?@[A-Za-z0-9](?:[A-Za-z0-9-]*[A-Za-z0-9])?(?:\.[A-Za-z]{2,})+$/;


    function showError(message) {
        if (!messageBox) {
            return;
        }

        messageBox.textContent = message;
        messageBox.className = "alert alert-danger auth-message";
    }


    function clearMessage() {
        if (!messageBox) {
            return;
        }

        messageBox.textContent = "";
        messageBox.className = "auth-message d-none";
    }


    function validateName() {
        const name = nameInput.value.trim();
        if (name.length === 0) {
            nameInput.setCustomValidity("");
            return false;
        }

        if (
            name.length < 2 ||
            name.length > 30 ||
            !namePattern.test(name)
        ) {
            nameInput.setCustomValidity(
                "Enter a valid gamer name using 2–30 letters. " +
                "Spaces, apostrophes, and hyphens are allowed " +
                "between name parts. Numbers and symbol-only names " +
                "are not allowed."
            );

            return false;
        }

        nameInput.setCustomValidity("");
        return true;
    }


    function validateEmail() {
        const email = emailInput.value.trim();

        if (email.length === 0) {
            emailInput.setCustomValidity("");
            return false;
        }

        if (
            email.length > 254 ||
            !emailPattern.test(email)
        ) {
            emailInput.setCustomValidity(
                "Enter a valid email address, such as player@gmail.com."
            );

            return false;
        }

        emailInput.setCustomValidity("");
        return true;
    }


    function validatePassword() {
        const password = passwordInput.value;

        if (password.length === 0) {
            passwordInput.setCustomValidity("");
            return false;
        }

        if (password.length < 8) {
            passwordInput.setCustomValidity(
                "Your password must contain at least 8 characters."
            );

            return false;
        }

        if (password.length > 64) {
            passwordInput.setCustomValidity(
                "Your password cannot exceed 64 characters."
            );

            return false;
        }

        passwordInput.setCustomValidity("");
        return true;
    }


    function validateAll() {
        // Run every validation instead of stopping at the first failure.
        const validName = validateName();
        const validEmail = validateEmail();
        const validPassword = validatePassword();

        return validName && validEmail && validPassword;
    }


    function showFirstInvalidField() {
        const inputs = [
            nameInput,
            emailInput,
            passwordInput
        ];

        const firstInvalid = inputs.find(function (input) {
            return !input.validity.valid;
        });

        if (firstInvalid) {
            firstInvalid.reportValidity();
            firstInvalid.focus();
        }
    }

    [nameInput, emailInput, passwordInput].forEach(function (input) {
        input.addEventListener("input", function () {
            if (input === nameInput) {
                validateName();
            }

            if (input === emailInput) {
                validateEmail();
            }

            if (input === passwordInput) {
                validatePassword();
            }

            clearMessage();
        });

        input.addEventListener("change", function () {
            if (input === nameInput) {
                validateName();
            }

            if (input === emailInput) {
                validateEmail();
            }

            if (input === passwordInput) {
                validatePassword();
            }
        });
    });

    if (submitButton) {
        submitButton.addEventListener("click", function () {
            if (!validateAll()) {
                showError(
                    "Your account was not created. Please correct " +
                    "the highlighted fields."
                );

                showFirstInvalidField();
            }
        });
    }

    document.addEventListener(
        "submit",
        function (event) {
            if (event.target !== registerForm) {
                return;
            }

            if (!validateAll()) {
                event.preventDefault();
                event.stopImmediatePropagation();

                showError(
                    "Registration failed. Please check your gamer name, " +
                    "email address, and password."
                );

                showFirstInvalidField();
            }
        },
        true
    );

});
