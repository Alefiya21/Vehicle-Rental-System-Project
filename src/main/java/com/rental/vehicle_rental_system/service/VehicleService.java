package com.rental.vehicle_rental_system.service;

import com.rental.vehicle_rental_system.dto.VehicleDto;
import com.rental.vehicle_rental_system.exception.ResourceNotFoundException;
import com.rental.vehicle_rental_system.model.Vehicle;
import com.rental.vehicle_rental_system.repository.VehicleRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
public class VehicleService {

    @Autowired
    private VehicleRepository vehicleRepository;


    public List<VehicleDto> getAllVehicles() {
        List<Vehicle> vehicles = vehicleRepository.findAll();

        return vehicles.stream()
                .map(VehicleDto::new)
                .collect(Collectors.toList());
    }

    public List<VehicleDto> getVehiclesByType(String type) {
        List<Vehicle> vehicles = vehicleRepository.findByType(type);
        return vehicles.stream()
                .map(VehicleDto::new)
                .collect(Collectors.toList());
    }

    public Vehicle getVehicleById(Long id) {
        return vehicleRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Vehicle not found with id: " + id));
    }


    public VehicleDto createVehicle(VehicleDto vehicleDto) {
        Vehicle vehicle = new Vehicle();
        vehicle.setName(vehicleDto.getName());
        vehicle.setType(vehicleDto.getType());
        vehicle.setModel(vehicleDto.getModel());
        vehicle.setYear(vehicleDto.getYear());
        vehicle.setRegistrationNumber(vehicleDto.getRegistrationNumber());
        vehicle.setRentalRate(vehicleDto.getRentalRate());
        vehicle.setAvailable(true);
        vehicle.setImageUrl(vehicleDto.getImageUrl());
        vehicle.setDescription(vehicleDto.getDescription());

        Vehicle savedVehicle = vehicleRepository.save(vehicle);

        return new VehicleDto(savedVehicle);
    }
}
