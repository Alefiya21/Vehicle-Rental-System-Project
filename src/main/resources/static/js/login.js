document.addEventListener('DOMContentLoaded', function () {
    const loginForm = document.getElementById('login-form');
    const errorMessage = document.getElementById('error-message');

    loginForm.addEventListener('submit', function (e) {
        e.preventDefault();

        const username = document.getElementById('username').value;
        const password = document.getElementById('password').value;

        if (!username || !password) {
            errorMessage.textContent = 'Please enter both username and password';
            errorMessage.style.display = 'block';
            return;
        }

        fetch(`/api/auth/login`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json', 
            },
            body: JSON.stringify({ username, password }),
        })
            .then((response) => {
                if (!response.ok) {
                    throw new Error('Invalid username or password');
                }
                return response.json();
            })
            .then((user) => {
                localStorage.setItem('userId', user.id);
                localStorage.setItem('username', user.username);
                localStorage.setItem('roles', JSON.stringify(user.roles));

                if (user.roles.includes('ROLE_ADMIN')) {
                    window.location.href = '/admin-dashboard';
                } else {
                    window.location.href = '/user-dashboard';
                }
                
            })
            .catch((error) => {
                errorMessage.textContent = error.message;
                errorMessage.style.display = 'block';
            });
    });
});