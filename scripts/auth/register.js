async function handleRegister() {
    const username = document.getElementById('register-username').value;
    const email = document.getElementById('register-email').value;
    const password = document.getElementById('register-password').value;

    const response = await fetch('/api/auth/register.php', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, email, password }),
    });

    const result = await response.json();
    if (result.success) {
        alert('Registration successful!');
        window.location.href = 'login.html';
    } else {
        alert(result.error);
    }
}
