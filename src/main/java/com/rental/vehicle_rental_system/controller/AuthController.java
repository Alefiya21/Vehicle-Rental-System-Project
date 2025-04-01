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
        
        UserDto userDto = new UserDto(user);

        return ResponseEntity.ok(userDto);
    }
}
