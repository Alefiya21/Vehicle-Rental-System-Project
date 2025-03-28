package com.rental.vehicle_rental_system.controller;

import com.rental.vehicle_rental_system.dto.BookingResponseDto;
import com.rental.vehicle_rental_system.dto.UserDto;
import com.rental.vehicle_rental_system.dto.VehicleDto;
import com.rental.vehicle_rental_system.model.Vehicle;
import com.rental.vehicle_rental_system.service.BookingService;
import com.rental.vehicle_rental_system.service.UserService;
import com.rental.vehicle_rental_system.service.VehicleService;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/admin")
public class AdminController {

    @Autowired
    private UserService userService;

    @Autowired
    private BookingService bookingService;

    @Autowired
    private VehicleService vehicleService;

    // User Management
    @PostMapping("/register")
    public ResponseEntity<UserDto> registerUser(@Valid @RequestBody UserDto userDto) {
        UserDto createdUser = userService.createUser(userDto); 
        return new ResponseEntity<>(createdUser, HttpStatus.CREATED);
    }

    @GetMapping("/users")
    public ResponseEntity<List<UserDto>> getAllUsers() {
        return ResponseEntity.ok(userService.getAllUsers());
    }

    // Booking Management
    @GetMapping("/bookings")
    public ResponseEntity<List<BookingResponseDto>> getAllBookings() {

        return ResponseEntity.ok(bookingService.getAllBookings());
    }

    // Vehicle Management

    @GetMapping("/vehicles")
    public ResponseEntity<List<VehicleDto>> getAllVehicles() {
        return ResponseEntity.ok(vehicleService.getAllVehicles());
    }

    @PostMapping("/vehicles")
    public ResponseEntity<Vehicle> createVehicle(@Valid @RequestBody VehicleDto vehicleDto) {
        return new ResponseEntity<>(vehicleService.createVehicle(vehicleDto), HttpStatus.CREATED);
    }
}