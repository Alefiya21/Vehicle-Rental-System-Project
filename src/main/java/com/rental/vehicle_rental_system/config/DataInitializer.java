package com.rental.vehicle_rental_system.config;

import com.rental.vehicle_rental_system.model.User;
import com.rental.vehicle_rental_system.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.CommandLineRunner;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

import java.util.HashSet;
import java.util.Set;

@Configuration
public class DataInitializer {

    @Autowired
    private UserRepository userRepository;

    @Bean
    public CommandLineRunner initData() {
        return args -> {
            // Check if admin user exists
            if (!userRepository.existsByUsername("admin")) {
                // Create admin user
                User admin = new User();
                admin.setUsername("admin");
                admin.setPassword("admin123"); // Store password as plain text
                admin.setFullName("System Admin");
                admin.setEmail("admin@example.com");
                admin.setPhoneNumber("1234567890");

                Set<String> roles = new HashSet<>();
                roles.add("ROLE_ADMIN");
                admin.setRoles(roles);

                userRepository.save(admin);

                System.out.println("Admin user created successfully!");
            }
        };
    }
}
