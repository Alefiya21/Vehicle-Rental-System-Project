package com.rental.vehicle_rental_system.controller;

import com.rental.vehicle_rental_system.dto.UpdateUserDto;
import com.rental.vehicle_rental_system.dto.UserDto;
import com.rental.vehicle_rental_system.model.User;
import com.rental.vehicle_rental_system.service.UserService;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/users")
public class UserController {

    @Autowired
    private UserService userService;

    @GetMapping("/{id}")
    public ResponseEntity<UserDto> getUserById(@PathVariable("id") Long id) {

        User user = userService.getUserById(id);

        // Convert User to UserDto (hiding password)
        UserDto userDto = new UserDto(
            user.getId(),
            user.getUsername(),
            user.getFullName(),
            user.getEmail(),
            user.getPhoneNumber(),
            user.getRoles()
        );

        return ResponseEntity.ok(userDto);
    }

    @PutMapping("/{id}")
    public ResponseEntity<UserDto> updateUser(@PathVariable Long id, @Valid @RequestBody UpdateUserDto userDto) {
        User updatedUser = userService.updateUser(id, userDto);

        UserDto responseDto = new UserDto(
            updatedUser.getId(),
            updatedUser.getUsername(),
            updatedUser.getFullName(),
            updatedUser.getEmail(),
            updatedUser.getPhoneNumber(),
            updatedUser.getRoles()
        );

        return ResponseEntity.ok(responseDto);
    }
  
}
