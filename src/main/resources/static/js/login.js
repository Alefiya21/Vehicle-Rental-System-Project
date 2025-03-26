document.addEventListener('DOMContentLoaded', function () {
    // Login Form Submission
    const loginForm = document.getElementById('login-form');
    const errorMessage = document.getElementById('error-message');

    loginForm.addEventListener('submit', function (e) {
        e.preventDefault();

        const username = document.getElementById('username').value;
        const password = document.getElementById('password').value;

        // Form validation
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
                    console.log("Redirecting to admin dashboard...");
                    window.location.href = '/admin-dashboard';
                } else {
                    console.log("Redirecting to user dashboard...");
                    window.location.href = '/user-dashboard';
                }
                
            })
            .catch((error) => {
                errorMessage.textContent = error.message;
                errorMessage.style.display = 'block';
            });
    });

    const registerLink = document.getElementById('register-link');
    const registerModal = document.getElementById('register-modal');
    const closeRegister = registerModal.querySelector('.close');
    
    registerLink.addEventListener('click', function(e) {
        e.preventDefault();
        registerModal.style.display = 'block';
    });
    
    closeRegister.addEventListener('click', function() {
        registerModal.style.display = 'none';
    });
    
    window.addEventListener('click', function(e) {
        if (e.target === registerModal) {
            registerModal.style.display = 'none';
        }
    });

    // Register Form Submission
    const registerForm = document.getElementById('register-form');
    const registerErrorMessage = document.getElementById('register-error-message');
    
    registerForm.addEventListener('submit', function(e) {
        e.preventDefault();
        
        const username = document.getElementById('reg-username').value;
        const password = document.getElementById('reg-password').value;
        const fullName = document.getElementById('reg-fullname').value;
        const email = document.getElementById('reg-email').value;
        const phoneNumber = document.getElementById('reg-phone').value;
        
        // Form validation
        if (!username || !password || !fullName || !email || !phoneNumber) {
            registerErrorMessage.textContent = 'Please fill in all fields';
            registerErrorMessage.style.display = 'block';
            return;
        }
        
        fetch('/api/auth/register', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                username: username,
                password: password,
                fullName: fullName,
                email: email,
                phoneNumber: phoneNumber
            })
        })
        .then(response => {
            if (!response.ok) {
                throw new Error('Registration failed. Please try again.');
            }
            return response.json();
        })
        .then(data => {
            alert('Registration successful! Please login.');
            registerModal.style.display = 'none';
            registerForm.reset();
        })
        .catch(error => {
            registerErrorMessage.textContent = error.message;
            registerErrorMessage.style.display = 'block';
        });
    });
});