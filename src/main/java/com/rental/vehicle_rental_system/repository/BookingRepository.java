package com.rental.vehicle_rental_system.repository;

import com.rental.vehicle_rental_system.model.Booking;
import com.rental.vehicle_rental_system.model.User;
import com.rental.vehicle_rental_system.model.Vehicle;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.time.LocalDateTime;
import java.util.List;

@Repository
public interface BookingRepository extends JpaRepository<Booking, Long> {
    List<Booking> findByUser(User user);
    List<Booking> findByVehicle(Vehicle vehicle);

    @Query("SELECT b FROM Booking b WHERE b.vehicle.id = :vehicleId " +
    "AND ((b.startDate < :endDate AND b.endDate > :startDate))")
    List<Booking> findOverlappingBookings(@Param("vehicleId") Long vehicleId, 
                                    @Param("startDate") LocalDateTime startDate, 
                                    @Param("endDate") LocalDateTime endDate);

}