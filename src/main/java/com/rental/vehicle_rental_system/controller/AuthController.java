package com.rental.vehicle_rental_system.controller;

import com.rental.vehicle_rental_system.dto.LoginDto;
import com.rental.vehicle_rental_system.dto.UserDto;
import com.rental.vehicle_rental_system.model.User;
import com.rental.vehicle_rental_system.service.UserService;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/auth")
public class AuthController {

    @Autowired
    private UserService userService;

    @PostMapping("/login")
    public ResponseEntity<UserDto> loginUser(@Valid @RequestBody LoginDto loginDto) {
        User user = userService.getUserByUsername(loginDto.getUsername());

        if (user == null || !user.getPassword().equals(loginDto.getPassword())) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).build(); 
        }
        UserDto userDto = new UserDto(
            user.getId(),
            user.getUsername(),
            null, 
            user.getFullName(),
            user.getEmail(),
            user.getPhoneNumber(),
            user.getRoles()
        );

        return ResponseEntity.ok(userDto);
    }

    @PostMapping("/register")
    public ResponseEntity<UserDto> registerUser(@Valid @RequestBody UserDto userDto) {
        UserDto createdUser = userService.createUser(userDto); // Default role is assigned in UserService
        return new ResponseEntity<>(createdUser, HttpStatus.CREATED);
    }
}
