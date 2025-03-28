package com.rental.vehicle_rental_system.model;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;
import java.util.HashSet;
import java.util.Set;


@Entity
@Table(name = "vehicles")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class Vehicle {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private String name;

    @Column(nullable = false)
    private String type; // Car, Bike

    @Column(nullable = false)
    private String model;

    @Column(nullable = false)
    private String year;

    @Column(nullable = false)
    private String registrationNumber;

    @Column(nullable = false)
    private BigDecimal rentalRate; // Per day

    @Column(nullable = false)
    private boolean available = true;

    @Column(length = 1000)
    private String imageUrl;

    @Column(length = 1000)
    private String description;

    @OneToMany(mappedBy = "vehicle", cascade = CascadeType.ALL)
    private Set<Booking> bookings = new HashSet<>();
}
