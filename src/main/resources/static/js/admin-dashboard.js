document.addEventListener('DOMContentLoaded', function () {
    const username = localStorage.getItem('username');
    if (!username) {
        alert("You are not logged in. Redirecting to login page...");
        window.location.href = '/login';
        return;
    }

    // Navigation
    const navLinks = document.querySelectorAll('.nav a');
    const sections = document.querySelectorAll('.section');

    navLinks.forEach(link => {
        link.addEventListener('click', function (e) {
            e.preventDefault();

            const targetSection = this.getAttribute('data-section');

            if (targetSection) {
                // Update active nav link
                navLinks.forEach(link => link.classList.remove('active'));
                this.classList.add('active');

                // Show target section
                sections.forEach(section => section.classList.remove('active'));
                document.getElementById(`${targetSection}-section`).classList.add('active');
            }
        });
    });

    // Logout
    document.getElementById('logout-btn').addEventListener('click', function (e) {
        e.preventDefault();
        localStorage.clear();
        window.location.href = '/login';
    });

    // Load vehicles
    loadVehicles();

    // Load bookings
    loadBookings();

    // Load users
    loadUsers();

    // Add Vehicle Button
    document.getElementById('add-vehicle-btn').addEventListener('click', function () {
        openVehicleModal();
    });

    // Add User Button
    document.getElementById('add-user-btn').addEventListener('click', function () {
        openUserModal();
    });

    // Vehicle Modal
    const vehicleModal = document.getElementById('vehicle-modal');
    const closeVehicle = vehicleModal.querySelector('.close');

    closeVehicle.addEventListener('click', function () {
        vehicleModal.style.display = 'none';
    });

    window.addEventListener('click', function (e) {
        if (e.target === vehicleModal) {
            vehicleModal.style.display = 'none';
        }
    });

    // Vehicle Form Submission
    const vehicleForm = document.getElementById('vehicle-form');
    vehicleForm.addEventListener('submit', function (e) {
        e.preventDefault();
        saveVehicle();
    });

    // User Modal
    const userModal = document.getElementById('user-modal');
    const closeUser = userModal.querySelector('.close');

    closeUser.addEventListener('click', function () {
        userModal.style.display = 'none';
    });

    window.addEventListener('click', function (e) {
        if (e.target === userModal) {
            userModal.style.display = 'none';
        }
    });

    // User Form Submission
    const userForm = document.getElementById('user-form');
    userForm.addEventListener('submit', function (e) {
        e.preventDefault();
        saveUser();
    });
});

// API call helper function
function apiCall(url, method = 'GET', body = null) {
    const options = {
        method: method,
        headers: {
            'Content-Type': 'application/json'
        }
    };

    if (body) {
        options.body = JSON.stringify(body);
    }

    return fetch(url, options)
        .then(response => {
            if (!response.ok) {
                throw new Error('API call failed');
            }

            const contentType = response.headers.get("content-type");
            if (contentType && contentType.includes("application/json")) {
                return response.json();
            } else {
                return null; // Return null for empty responses (DELETE case)
            }
        });
}

// Load vehicles
function loadVehicles() {
    const vehiclesContainer = document.getElementById('vehicles-container');
    vehiclesContainer.innerHTML = '<div class="loading">Loading vehicles...</div>';
    
    apiCall('/api/admin/vehicles')
        .then(vehicles => {
            if (vehicles.length === 0) {
                vehiclesContainer.innerHTML = '<div class="no-data">No vehicles found</div>';
                return;
            }

            const table = document.createElement('table');
            table.className = 'vehicles-list';

            table.innerHTML = `
                <thead>
                    <tr>
                        <th>Name</th>
                        <th>Type</th>
                        <th>Model</th>
                        <th>Year</th>
                        <th>Registration</th>
                        <th>Rate</th>
                        <th>Currently Booked</th>
                    </tr>
                </thead>
                <tbody></tbody>
            `;

            const tbody = table.querySelector('tbody');

            vehicles.forEach(vehicle => {
                const tr = document.createElement('tr');

                // Logic to determine if the vehicle is available or not
                const isBooked = vehicle.available ? 'No' : 'Yes';  

                tr.innerHTML = `
                    <td>${vehicle.name}</td>
                    <td>${vehicle.type}</td>
                    <td>${vehicle.model}</td>
                    <td>${vehicle.year}</td>
                    <td>${vehicle.registrationNumber}</td>
                    <td>$${vehicle.rentalRate}</td>
                    <td>${isBooked}</td>  <!-- Updated availability status -->
                `;

                tbody.appendChild(tr);
            });

            vehiclesContainer.innerHTML = '';
            vehiclesContainer.appendChild(table);
        })
        .catch(error => {
            vehiclesContainer.innerHTML = '<div class="error">Failed to load vehicles</div>';
        });
}

// Open vehicle modal
function openVehicleModal(vehicleId = null) {
    const vehicleModal = document.getElementById('vehicle-modal');
    const vehicleForm = document.getElementById('vehicle-form');
    const vehicleModalTitle = document.getElementById('vehicle-modal-title');
    const vehicleErrorMessage = document.getElementById('vehicle-error-message');
    
    // Reset form
    vehicleForm.reset();
    vehicleErrorMessage.style.display = 'none';

    // Add mode
    vehicleModalTitle.textContent = 'Add Vehicle';
    document.getElementById('vehicle-id').value = '';
    
    // Show modal
    vehicleModal.style.display = 'block';
}

// Save vehicle
function saveVehicle() {
    const vehicleId = document.getElementById('vehicle-id').value;
    const vehicleErrorMessage = document.getElementById('vehicle-error-message');
    
    const vehicleData = {
        name: document.getElementById('vehicle-name').value,
        type: document.getElementById('vehicle-type-select').value,
        model: document.getElementById('vehicle-model').value,
        year: document.getElementById('vehicle-year').value,
        registrationNumber: document.getElementById('vehicle-reg').value,
        rentalRate: document.getElementById('vehicle-rate').value,
        imageUrl: document.getElementById('vehicle-image').value,
        description: document.getElementById('vehicle-desc').value
    };
    
    // Validation
    if (!vehicleData.name || !vehicleData.type || !vehicleData.model || !vehicleData.year || !vehicleData.registrationNumber || !vehicleData.rentalRate) {
        vehicleErrorMessage.textContent = 'Please fill in all required fields';
        vehicleErrorMessage.style.display = 'block';
        return;
    }
    
    let url = '/api/admin/vehicles';
    let method = 'POST';
    
    apiCall(url, method, vehicleData)
        .then(vehicle => {
            alert('Vehicle added successfully!');
            document.getElementById('vehicle-modal').style.display = 'none';
            loadVehicles();
        })
        .catch(error => {
            vehicleErrorMessage.textContent = 'Failed to save vehicle.';
            vehicleErrorMessage.style.display = 'block';
        });
}

// Load bookings
function loadBookings() {
    const bookingsContainer = document.getElementById('bookings-container');
    bookingsContainer.innerHTML = '<div class="loading">Loading bookings...</div>';
    
    apiCall('/api/admin/bookings') // Admin-specific endpoint
        .then(bookings => {
            if (bookings.length === 0) {
                bookingsContainer.innerHTML = '<div class="no-data">No bookings found</div>';
                return;
            }
            
            const table = document.createElement('table');
            table.className = 'bookings-list';
            
            table.innerHTML = `
                <thead>
                    <tr>
                        <th>User</th>
                        <th>Vehicle</th>
                        <th>Start Date</th>
                        <th>End Date</th>
                        <th>Total Cost</th>
                        <th>Status</th>
                    </tr>
                </thead>
                <tbody></tbody>
            `;
            
            const tbody = table.querySelector('tbody');
            
            bookings.forEach(booking => {
                const tr = document.createElement('tr');
                
                const startDate = new Date(booking.startDate).toLocaleString();
                const endDate = new Date(booking.endDate).toLocaleString();
                
                tr.innerHTML = `
                    <td>${booking.username}</td>
                    <td>${booking.vehicleName}</td> 
                    <td>${startDate}</td>
                    <td>${endDate}</td>
                    <td>$${booking.totalCost}</td>
                    <td>${booking.status}</td>
                `;          
                tbody.appendChild(tr);
            });
            
            bookingsContainer.innerHTML = '';
            bookingsContainer.appendChild(table);
        })
        .catch(error => {
            console.error('Error loading bookings:', error);
            bookingsContainer.innerHTML = '<div class="error">Failed to load bookings</div>';
        });
}   


// Load users
function loadUsers() {
    const usersContainer = document.getElementById('users-container');
    usersContainer.innerHTML = '<div class="loading">Loading users...</div>';
    
    apiCall('/api/admin/users')
        .then(users => {
            console.log('Fetched users:', users);
            if (users.length === 0) {
                usersContainer.innerHTML = '<div class="no-data">No users found</div>';
                return;
            }
            
            const table = document.createElement('table');
            table.className = 'users-list';
            
            table.innerHTML = `
                <thead>
                    <tr>
                        <th>Username</th>
                        <th>Full Name</th>
                        <th>Email</th>
                        <th>Phone</th>
                        <th>Role</th>
                    </tr>
                </thead>
                <tbody></tbody>
            `;
            
            const tbody = table.querySelector('tbody');
            
            users.forEach(user => {
                const tr = document.createElement('tr');
                
                const role = user.roles && user.roles.includes('ROLE_ADMIN') ? 'Admin' : 'User';

                tr.innerHTML = `
                    <td>${user.username}</td>
                    <td>${user.fullName}</td>
                    <td>${user.email}</td>
                    <td>${user.phoneNumber}</td>
                    <td>${role}</td>
                `;
                
                tbody.appendChild(tr);
            });
            
            usersContainer.innerHTML = '';
            usersContainer.appendChild(table);

        })
        .catch(error => {
            usersContainer.innerHTML = '<div class="error">Failed to load users</div>';
        });
}

// Open user modal
function openUserModal(userId = null) {
    const userModal = document.getElementById('user-modal');
    const userForm = document.getElementById('user-form');
    const userModalTitle = document.getElementById('user-modal-title');
    const userErrorMessage = document.getElementById('user-error-message');
    
    // Reset form
    userForm.reset();
    userErrorMessage.style.display = 'none';
    
    // Add mode
    userModalTitle.textContent = 'Add User';
    document.getElementById('user-id').value = '';
    document.getElementById('user-username').readOnly = false; // Can set username
    document.getElementById('user-password').required = true; // Password required for new user
    
    // Show modal
    userModal.style.display = 'block'; 
}

// Save user
function saveUser() {
    const userErrorMessage = document.getElementById('user-error-message');

    const userData = {
        username: document.getElementById('user-username').value,
        password: document.getElementById('user-password').value,
        fullName: document.getElementById('user-fullname').value,
        email: document.getElementById('user-email').value,
        phoneNumber: document.getElementById('user-phone').value
    };

    if (!userData.username || !userData.password || !userData.fullName || !userData.email || !userData.phoneNumber) {
        userErrorMessage.textContent = 'Please fill in all fields';
        userErrorMessage.style.display = 'block';
        return;
    }

    fetch('/api/admin/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(userData)
    })
    .then(response => {
        if (!response.ok) {
            throw new Error('Registration failed. Please try again.');
        }
        return response.json();
    })
    .then(data => {
        alert('User registered successfully!');
        document.getElementById('user-modal').style.display = 'none';
        document.getElementById('user-form').reset(); 
        loadUsers();
    })
    .catch(error => {
        userErrorMessage.textContent = error.message;
        userErrorMessage.style.display = 'block';
    });
}
