async function checkAvailability(field) {
    const value = document.getElementById(`register-${field}`).value;
    const feedback = document.getElementById(`${field}-feedback`);
    const icon = document.getElementById(`${field}-icon`);

    if (!value.trim()) {
        feedback.textContent = '';
        icon.className = '';
        return;
    }

    try {
        const response = await fetch(`http://127.0.0.1/SECUREROTISALESMANAGEMENT/api/auth/check_availability.php`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ field, value }),
        });

        const result = await response.json();

        if (result.available) {
            icon.className = 'fa-solid fa-check success-icon form-control-feedback';
            feedback.textContent = `${field.charAt(0).toUpperCase() + field.slice(1)} is available.`;
            feedback.style.color = 'green';
        } else {
            icon.className = 'fa-solid fa-exclamation error-icon form-control-feedback';
            feedback.textContent = `${field.charAt(0).toUpperCase() + field.slice(1)} is already taken.`;
            feedback.style.color = 'red';
        }
    } catch (error) {
        console.error('Error checking availability:', error);
        feedback.textContent = `Error checking ${field} availability.`;
        feedback.style.color = 'red';
    }
}
