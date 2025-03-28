package com.rental.vehicle_rental_system.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Positive;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class VehicleDto {

    private Long id;
    
    @NotBlank(message = "Name is required")
    private String name;
    
    @NotBlank(message = "Type is required")
    private String type;
    
    @NotBlank(message = "Model is required")
    private String model;
    
    @NotBlank(message = "Year is required")
    private String year;
    
    @NotBlank(message = "Registration number is required")
    private String registrationNumber;
    
    @NotNull(message = "Rental rate is required")
    @Positive(message = "Rental rate must be positive")
    private BigDecimal rentalRate;
    
    private boolean available;
    
    private String imageUrl;
    
    private String description;
}
