# Vehicle Rental System

## Overview
The Vehicle Rental System is a web-based application that allows users to book vehicles and admins to manage vehicles, users, and bookings.

## Functionalities

### Admin Functionalities:
- **Add and View Users:** Admins can add new users to the system and view a list of all existing users.
- **Add and View Vehicles:** Admins can add new vehicles to the system and view a list of all available vehicles.
- **View All User Bookings:** Admins can view the booking history of all users, including the details of each booking.

### User Functionalities:
- **Book Available Vehicles:** Users can book vehicles for a specific duration, subject to availability.
- **View Booking History:** Users can view their own booking history.
- **View User Properties:** Users can view and update their profile details such as their name, email, and phone number.

## Technologies Used
- **Frontend:** HTML, CSS, JavaScript
- **Backend:** Java (Spring Boot Framework)
- **Database:** PostgreSQL
- **Tools:** VS Code, Postman

## Architecture
The system follows a layered architecture:
- **Client Browser (Frontend):** User-facing interface using HTML, CSS, and JS.
- **Backend (Spring Boot):** Handles API requests, business logic, and data processing.
- **Database (PostgreSQL):** Stores user, vehicle, and booking data.

## Setup Instructions

### Prerequisites:
1. Java 17 installed
2. PostgreSQL installed and running
3. IntelliJ IDEA or VS Code installed
4. Postman for API testing

### Steps:
1. **Clone the Repository:**
   ```sh
   git clone <repository_url>
   cd vehicle-rental-system
   ```
2. **Set Up Database:**
   - Create a PostgreSQL database named `vehicle_rental`.
   - Update database configurations in `application.properties`.
3. **Run the Application:**
   - Open the project in IntelliJ IDEA or VS Code.
   - Run the main method in `VehicleRentalSystemApplication`.
4. **Frontend Setup:**
   - Place frontend files (HTML, CSS, JS) in the `resources` folder.
5. **Test APIs:**
   - Use Postman to test endpoints listed in the API Endpoints section.

## Folder Structure
```
vehicle-rental-system/
├── src/
│   ├── main/
│   │   ├── java/
│   │   │   └── com.rental.vehicle_rental_system/
│   │   │       ├── controller/
│   │   │       ├── dto/
│   │   │       ├── model/
│   │   │       ├── service/
│   │   │       ├── repository/
│   │   │       └── VehicleRentalSystemApplication.java
│   │   └── resources/
│   │       ├── static/  (Frontend files)
│   │       └── application.properties
└── README.md
```

## API Endpoints

### Auth APIs
| Method | URL | Description |
|--------|------------------|----------------|
| POST   | /api/auth/login  | Login a user   |

### Admin APIs
| Method | URL | Description |
|--------|--------------------|---------------------------|
| POST   | /api/admin/register | Register a new user     |
| GET    | /api/admin/users    | View all users          |
| GET    | /api/admin/bookings | View all bookings       |
| GET    | /api/admin/vehicles | View all vehicles      |
| POST   | /api/admin/vehicles | Add a new vehicle      |

### User APIs
| Method | URL | Description |
|--------|------------------|----------------|
| GET    | /api/users/{id}  | Get user by ID |

### Vehicle APIs
| Method | URL | Description |
|--------|----------------------|--------------------------|
| GET    | /api/vehicles        | View all vehicles       |
| GET    | /api/vehicles/type/{type} | View vehicles by type |
| GET    | /api/vehicles/{id}   | Get vehicle details by ID |

### Booking APIs
| Method | URL | Description |
|--------|-------------------------------|------------------------------|
| GET    | /api/bookings/user/{userId}   | Get bookings by user       |
| POST   | /api/bookings                 | Create a booking          |
| GET    | /api/bookings/check-availability | Check vehicle availability |

## Testing with Postman
1. Open Postman.
2. Use the above API endpoints to test functionalities.
3. Set the request type (GET, POST, PUT) and provide necessary JSON data in the request body where required.

This README provides a comprehensive guide to setting up and using the Vehicle Rental System. Ensure all configurations are correctly set before running the application.

