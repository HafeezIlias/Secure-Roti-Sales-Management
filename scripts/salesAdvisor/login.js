async function handleLogin() {
    const username = document.getElementById('username').value.trim();
    const password = document.getElementById('password').value.trim();
    const errorElement = document.getElementById('login-error');

    errorElement.classList.add('d-none');

    if (!username || !password) {
        errorElement.innerText = 'Please fill in all fields.';
        errorElement.classList.remove('d-none');
        return;
    }

    try {
        const response = await fetch('http://127.0.0.1/SECURE%20ROTI%20SALES%20MANAGEMENT/api/login.php', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ username, password })
        });

        const result = await response.json();

        if (response.ok && result.success) {
            window.location.href = 'dashboard_salesAdvisor.html';
        } else {
            errorElement.innerText = result.error || 'Invalid credentials';
            errorElement.classList.remove('d-none');
        }
    } catch (error) {
        console.error('Login Error:', error);
        errorElement.innerText = 'An error occurred. Please try again later.';
        errorElement.classList.remove('d-none');
    }
}
