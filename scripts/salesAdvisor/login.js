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
        const response = await fetch('http://127.0.0.1/SECUREROTISALESMANAGEMENT/api/salesAdvisor/login.php', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ username, password })
        });

        const result = await response.json();
        //console.log(result); // Debugging purpose

        if (response.ok && result.success) {
            // Redirect based on role
            switch (result.role) {
                case 'clerk':
                    window.location.href = '/view/clerk/dashboard_clerk.html';
                    break;
                case 'supervisor':
                    window.location.href = '/view/salesAdvisor/dashboard_supervisor.html';
                    break;
                case 'admin':
                    window.location.href = '/view/admin/dashboard_admin.html';
                    break;
                default:
                    window.location.href = '/login_page.html';
            }
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
