package com.rental.vehicle_rental_system.controller;

import com.rental.vehicle_rental_system.dto.UserDto;
import com.rental.vehicle_rental_system.model.User;
import com.rental.vehicle_rental_system.service.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/users")
public class UserController {

    @Autowired
    private UserService userService;

    @GetMapping("/{id}")
    public ResponseEntity<UserDto> getUserById(@PathVariable Long id) {

        User user = userService.getUserById(id);

        UserDto userDto = new UserDto(user);

        return ResponseEntity.ok(userDto);
    }
}