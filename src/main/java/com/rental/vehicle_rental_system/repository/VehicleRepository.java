package com.rental.vehicle_rental_system.repository;

import com.rental.vehicle_rental_system.model.Vehicle;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface VehicleRepository extends JpaRepository<Vehicle, Long> {
    List<Vehicle> findByAvailableTrue();
    List<Vehicle> findByType(String type);
}
