async function handleLogin() {
    const username = document.getElementById('login-username').value;
    const password = document.getElementById('login-password').value;

    const response = await fetch('http://127.0.0.1/SECUREROTISALESMANAGEMENT/api/auth/login.php', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password }),
    });

    const result = await response.json();
    if (result.success) {
        alert('Login successful!');
        window.location.href = '/index.html';
    } else {
        alert(result.error);
    }
}
