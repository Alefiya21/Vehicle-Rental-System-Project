package com.rental.vehicle_rental_system.controller;

import com.rental.vehicle_rental_system.model.Vehicle;
import com.rental.vehicle_rental_system.dto.VehicleDto;
import com.rental.vehicle_rental_system.service.VehicleService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/vehicles")
public class VehicleController {

    @Autowired
    private VehicleService vehicleService;


    @GetMapping
    public ResponseEntity<List<VehicleDto>> getAllVehicles() {
        return ResponseEntity.ok(vehicleService.getAllVehicles());
    }
    
    @GetMapping("/type/{type}")
    public ResponseEntity<List<VehicleDto>> getVehiclesByType(@PathVariable String type) {
        return ResponseEntity.ok(vehicleService.getVehiclesByType(type));
    }

    @GetMapping("/{id}")
    public ResponseEntity<VehicleDto> getVehicleById(@PathVariable Long id) {

        Vehicle vehicle = vehicleService.getVehicleById(id);

        VehicleDto vehicleDto = new VehicleDto(vehicle);

        return ResponseEntity.ok(vehicleDto);
    }
}