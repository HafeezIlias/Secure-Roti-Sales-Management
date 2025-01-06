async function handleRegister() {
    const username = document.getElementById('register-username').value.trim();
    const fullname = document.getElementById('register-fullname').value.trim();
    const email = document.getElementById('register-email').value.trim();
    const password = document.getElementById('register-password').value.trim();
    const contact = document.getElementById('register-contact').value.trim();
    const address = document.getElementById('register-address').value.trim();
    const postcode = document.getElementById('register-postcode').value.trim();
    const country = document.getElementById('register-country').value.trim();
    const city = document.getElementById('register-city').value.trim();

    if (!validatePassword()) {
        alert('Please ensure your password meets the security requirements.');
        return;
    }

    if (!validateContact()) {
        alert('Please ensure your contact number follows the correct format.');
        return;
    }

    try {
        const response = await fetch('http://127.0.0.1/SECUREROTISALESMANAGEMENT/api/auth/register.php', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ username, fullname, email, password, contact, address, postcode, country, city }),
        });

        if (!response.ok) {
            throw new Error(`HTTP error! Status: ${response.status}`);
        }

        const result = await response.json();
        
        if (result.success) {
            alert(result.message || 'Registration successful!');
            window.location.href = 'login.html';
        } else {
            alert(result.error || 'An error occurred during registration.');
        }
    } catch (error) {
        console.error('Error:', error);
        alert('Failed to register. Please try again later.');
    }
}



function validatePassword() {
    const password = document.getElementById('register-password').value;
    const requirements = {
        length: /.{8,}/,
        uppercase: /[A-Z]/,
        lowercase: /[a-z]/,
        number: /\d/,
        special: /[@$!%*?&]/
    };

    const updateRequirement = (id, isValid) => {
        document.getElementById(id).style.color = isValid ? 'green' : 'red';
    };

    updateRequirement('length-req', requirements.length.test(password));
    updateRequirement('uppercase-req', requirements.uppercase.test(password));
    updateRequirement('lowercase-req', requirements.lowercase.test(password));
    updateRequirement('number-req', requirements.number.test(password));
    updateRequirement('special-req', requirements.special.test(password));

    return Object.values(requirements).every((regex) => regex.test(password));
}

// Restrict input to numbers, +, and backspace/delete keys
function restrictPhoneInput(event) {
    const input = event.target;
    input.value = input.value.replace(/[^0-9+]/g, '');
}

// Validate Contact Number
function validateContact() {
    const contact = document.getElementById('register-contact').value;
    const contactIcon = document.getElementById('contact-icon');
    const regex = /^(\+60\d{9,10}|0\d{9,10})$/;

    if (regex.test(contact)) {
        contactIcon.className = 'fa-solid fa-check success-icon form-control-feedback';
        contactIcon.style.color = 'green';
        return true;
    } else {
        contactIcon.className = 'fa-solid fa-exclamation error-icon form-control-feedback';
        contactIcon.style.color = 'red';
        return false;
    }
}


