document.addEventListener('DOMContentLoaded', function () {
    const username = localStorage.getItem('username');
    const userId = localStorage.getItem('userId');
    const userRoles = JSON.parse(localStorage.getItem('roles'));

    if (!userId || !userRoles) {
        console.log("No user session found! Redirecting to login...");
        window.location.href = '/login';
    } else if (!userRoles.includes("ROLE_USER")) {
        console.log("User does not have ROLE_USER! Redirecting to login...");
        window.location.href = '/login';
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
        localStorage.removeItem('username');
        localStorage.removeItem('userRoles');
        localStorage.removeItem('userId');
        window.location.href = '/login';
    });


    // Load user profile
    loadUserProfile();

    // Load vehicles
    loadVehicles();

    // Load bookings
    loadBookings();

    // Vehicle type filter
    document.getElementById('vehicle-type').addEventListener('change', function () {
        loadVehicles(this.value);
    });

    // Booking modal
    const bookingModal = document.getElementById('booking-modal');
    const closeBooking = bookingModal.querySelector('.close');

    closeBooking.addEventListener('click', function () {
        bookingModal.style.display = 'none';
    });

    window.addEventListener('click', function (e) {
        if (e.target === bookingModal) {
            bookingModal.style.display = 'none';
        }
    });

    // Booking form submission
    const bookingForm = document.getElementById('booking-form');
    bookingForm.addEventListener('submit', function (e) {
        e.preventDefault();
        createBooking();
    });

    // Calculate estimated cost when dates change
    document.getElementById('start-date').addEventListener('change', calculateEstimatedCost);
    document.getElementById('end-date').addEventListener('change', calculateEstimatedCost);
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
            return response.json();
        });
}


// Load user profile
function loadUserProfile() {
    const userId = localStorage.getItem('userId');

    if (!userId) {
        console.error("User ID not found in local storage!");
        return;
    }

    apiCall(`/api/users/${userId}`)
        .then(user => {
            document.getElementById('profile-username').textContent = user.username;
            document.getElementById('profile-fullname').textContent = user.fullName;
            document.getElementById('profile-email').textContent = user.email;
            document.getElementById('profile-phone').textContent = user.phoneNumber;
        })
        .catch(error => {
            console.error('Error loading profile:', error);
        });
}


// Load vehicles
// Load vehicles based on type
function loadVehicles(type = '') {
    const vehiclesContainer = document.getElementById('vehicles-container');
    vehiclesContainer.innerHTML = '<div class="loading">Loading vehicles...</div>';

    let url = '/api/vehicles';

    if (type && type !== 'all') {
        url = `/api/vehicles/type/${type}`;
    }

    apiCall(url, 'GET')
        .then(vehicles => {
            if (!vehicles || vehicles.length === 0) {
                vehiclesContainer.innerHTML = '<div class="no-data">No vehicles available</div>';
                return;
            }

            vehiclesContainer.innerHTML = '';

            vehicles.forEach(vehicle => {

                const vehicleCard = document.createElement('div');
                vehicleCard.className = 'vehicle-card';

                const imageUrl = vehicle.imageUrl;

                vehicleCard.innerHTML = `
                    <div class="vehicle-image">
                        <img src="${imageUrl}" alt="${vehicle.name}">
                    </div>
                    <div class="vehicle-info">
                        <h3>${vehicle.name}</h3>
                        <p><strong>Type:</strong> ${vehicle.type}</p>
                        <p><strong>Model:</strong> ${vehicle.model} (${vehicle.year})</p>
                        <p><strong>Rate:</strong> $${vehicle.rentalRate}/day</p>
                        <p>${vehicle.description || ''}</p>
                    </div>
                    <div class="vehicle-actions">
                        <button class="btn btn-primary book-btn" data-id="${vehicle.id}" data-rate="${vehicle.rentalRate}">Book Now</button>
                    </div>
                `;

                vehiclesContainer.appendChild(vehicleCard);
            });

            // Add event listeners to book buttons
            document.querySelectorAll('.book-btn').forEach(btn => {
                btn.addEventListener('click', function () {
                    openBookingModal(this.getAttribute('data-id'), this.getAttribute('data-rate'));
                });
            });
        })
        .catch(error => {
            console.error('Error loading vehicles:', error);
            vehiclesContainer.innerHTML = '<div class="error">Failed to load vehicles</div>';
        });
}


// Open booking modal
function openBookingModal(vehicleId, rate) {
    const bookingModal = document.getElementById('booking-modal');
    const vehicleDetails = document.getElementById('vehicle-details');
    const vehicleIdInput = document.getElementById('vehicle-id');

    document.getElementById('booking-form').reset();
    document.getElementById('booking-error-message').style.display = 'none';

    vehicleIdInput.value = vehicleId;

    bookingModal.style.display = 'block';

    // Load vehicle details
    apiCall(`/api/vehicles/${vehicleId}`)
        .then(vehicle => {
            vehicleDetails.innerHTML = `
                <h3>${vehicle.name}</h3>
                <p><strong>Type:</strong> ${vehicle.type}</p>
                <p><strong>Model:</strong> ${vehicle.model} (${vehicle.year})</p>
                <p><strong>Rate:</strong> $${vehicle.rentalRate}/day</p>
            `;

            const today = new Date();
            const todayStr = today.toISOString().split('T')[0]; 
            document.getElementById('start-date').min = todayStr;
        })
        .catch(error => {
            console.error('Failed to load vehicle details:', error);
            vehicleDetails.innerHTML = '<p class="error">Error loading vehicle details</p>';
        });
}


// Calculate estimated cost
function calculateEstimatedCost() {
    const startDate = document.getElementById('start-date').value;
    const endDate = document.getElementById('end-date').value;
    const vehicleId = document.getElementById('vehicle-id').value;

    if (startDate && endDate && vehicleId) {
        apiCall(`/api/vehicles/${vehicleId}`)
            .then(vehicle => {
                const start = new Date(startDate); 
                const end = new Date(endDate);

                // Calculate days
                const diffTime = Math.abs(end - start);
                const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24)); 

                // Calculate cost
                const cost = diffDays * vehicle.rentalRate;

                document.getElementById('total-cost').value = `$${cost.toFixed(2)}`;
            })
            .catch(error => {
                console.error('Error calculating cost:', error);
                document.getElementById('total-cost').value = 'Error calculating cost';
            });
    }
} 

function createBooking() {
    const bookingErrorMessage = document.getElementById('booking-error-message');
    const vehicleId = document.getElementById('vehicle-id').value;
    const startDate = document.getElementById('start-date').value;
    const endDate = document.getElementById('end-date').value;
    const userId = localStorage.getItem('userId');

    if (!userId) {
        console.error("User ID not found! Cannot create booking.");
        return;
    }

    if (!startDate || !endDate) {
        bookingErrorMessage.textContent = 'Please select both start and end dates';
        bookingErrorMessage.style.display = 'block';
        return;
    }

    const start = new Date(startDate).toISOString();
    const end = new Date(endDate).toISOString();

    if (start >= end) {
        bookingErrorMessage.textContent = 'End date must be after start date';
        bookingErrorMessage.style.display = 'block';
        return;
    }

    // Check vehicle availability first
    apiCall(`/api/bookings/check-availability?vehicleId=${vehicleId}&startDate=${start}&endDate=${end}`, 'GET')
        .then(response => {
            if (response.available) {
                return apiCall('/api/bookings', 'POST', {
                    userId: userId,
                    vehicleId: vehicleId,
                    startDate: start,
                    endDate: end
                });
            } else {
                throw new Error("Vehicle is not available for booking");
            }
        })
        .then(booking => {
            alert('Booking created successfully!');
            document.getElementById('booking-modal').style.display = 'none';

            // Reload vehicles and bookings
            loadVehicles();
            loadBookings();
        })
        .catch(error => {
            console.error("Booking API Error:", error);
            bookingErrorMessage.textContent = 'Failed to create booking. The vehicle might not be available for the selected dates.';
            bookingErrorMessage.style.display = 'block';
        });
}

// Load bookings
function loadBookings() {
    const bookingsContainer = document.getElementById('bookings-container');
    bookingsContainer.innerHTML = '<div class="loading">Loading bookings...</div>';
    
    const userId = localStorage.getItem('userId');
    if (!userId) {
        console.error('User ID not found in localStorage. Redirecting to login.');
        bookingsContainer.innerHTML = '<div class="error">User ID not found. Please log in again.</div>';
        window.location.href = '/login.html';
        return;
    }

    apiCall(`/api/bookings/user/${userId}`)
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
                const startDate = new Date(booking.startDate).toLocaleString();
                const endDate = new Date(booking.endDate).toLocaleString();

                const tr = document.createElement('tr');
                tr.innerHTML = `
                    <td>${booking.vehicleName || 'Unknown Vehicle'}</td>
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
            bookingsContainer.innerHTML = `<div class="error">Failed to load bookings: ${error.message || error}</div>`;
        });
}

