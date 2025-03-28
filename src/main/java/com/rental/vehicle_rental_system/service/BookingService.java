package com.rental.vehicle_rental_system.service;

import com.rental.vehicle_rental_system.dto.BookingDto;
import com.rental.vehicle_rental_system.dto.BookingResponseDto;
import com.rental.vehicle_rental_system.exception.BookingException;
import com.rental.vehicle_rental_system.model.Booking;
import com.rental.vehicle_rental_system.model.User;
import com.rental.vehicle_rental_system.model.Vehicle;
import com.rental.vehicle_rental_system.repository.BookingRepository;
import com.rental.vehicle_rental_system.repository.VehicleRepository;
import jakarta.transaction.Transactional;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.time.Duration;
import java.time.LocalDateTime;
import java.util.List;
import java.util.stream.Collectors;

@Service
public class BookingService {

    @Autowired
    private VehicleRepository vehicleRepository;

    @Autowired
    private BookingRepository bookingRepository;

    @Autowired
    private UserService userService;

    @Autowired
    private VehicleService vehicleService;


    @Transactional
    public List<BookingResponseDto> getAllBookings() {
        List<Booking> bookings = bookingRepository.findAll();

        return bookings.stream()
                .map(BookingResponseDto::new)
                .collect(Collectors.toList());
    }

    @Transactional
    public List<BookingResponseDto> getBookingsByUser(Long userId) {  
        User user = userService.getUserById(userId);
        List<Booking> bookings = bookingRepository.findByUser(user);

        return bookings.stream()
                .map(BookingResponseDto::new)
                .collect(Collectors.toList());
    }
 
    @Transactional
    public BookingResponseDto createBooking(BookingDto bookingDto) {
        User user = userService.getUserById(bookingDto.getUserId());
        Vehicle vehicle = vehicleService.getVehicleById(bookingDto.getVehicleId());
    

        List<Booking> overlappingBookings = bookingRepository.findOverlappingBookings(
                vehicle.getId(), bookingDto.getStartDate(), bookingDto.getEndDate());
    
        if (!overlappingBookings.isEmpty()) {
            throw new BookingException("Vehicle is already booked for the selected dates.");
        }
    
        long days = Duration.between(bookingDto.getStartDate(), bookingDto.getEndDate()).toDays();
        if (days < 1) days = 1; // Minimum 1 day
        BigDecimal totalCost = vehicle.getRentalRate().multiply(BigDecimal.valueOf(days));
    
        Booking booking = new Booking();
        booking.setUser(user);
        booking.setVehicle(vehicle);
        booking.setStartDate(bookingDto.getStartDate());
        booking.setEndDate(bookingDto.getEndDate());
        booking.setTotalCost(totalCost);
        booking.setStatus("CONFIRMED");
        booking.setBookingDate(LocalDateTime.now());
    
        Booking savedBooking = bookingRepository.save(booking);

        vehicle.setAvailable(false);
        vehicleRepository.save(vehicle);
    
        return new BookingResponseDto(savedBooking);
    }
    
    @Transactional
    public boolean isVehicleAvailable(Long vehicleId, LocalDateTime startDate, LocalDateTime endDate) {
        List<Booking> overlappingBookings = bookingRepository.findOverlappingBookings(vehicleId, startDate, endDate);
        return overlappingBookings.isEmpty();
    }
}
