package com.rental.vehicle_rental_system.exception;

import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.ResponseStatus;

@ResponseStatus(HttpStatus.BAD_REQUEST)
public class BookingException extends RuntimeException {
    public BookingException(String message) {
        super(message);
    }
}
