package com.rental.vehicle_rental_system.dto;

import com.rental.vehicle_rental_system.model.Booking;
import lombok.Data;

import java.math.BigDecimal;
import java.time.LocalDateTime;

import lombok.AllArgsConstructor;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class BookingResponseDto {
    private Long id;
    private Long vehicleId;
    private String vehicleName;
    private Long userId;
    private String username;
    private LocalDateTime startDate;
    private LocalDateTime endDate;
    private BigDecimal totalCost;
    private String status;
    private LocalDateTime bookingDate;

    public BookingResponseDto(Booking booking) {
        this.id = booking.getId();
        this.vehicleId = booking.getVehicle() != null ? booking.getVehicle().getId() : null;
        this.vehicleName = booking.getVehicle() != null ? booking.getVehicle().getName() : "Unknown Vehicle";
        this.userId = booking.getUser() != null ? booking.getUser().getId() : null;
        this.username = booking.getUser() != null ? booking.getUser().getUsername() : "Unknown User";
        this.startDate = booking.getStartDate();
        this.endDate = booking.getEndDate();
        this.totalCost = booking.getTotalCost();
        this.status = booking.getStatus();
        this.bookingDate = booking.getBookingDate();
    }
}

