package com.rental.vehicle_rental_system.controller;

import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.GetMapping;

@Controller
public class WebController {

    @GetMapping("/")
    public String home() {
        return "login";
    }
    
    @GetMapping("/login")
    public String login() {
        return "login";
    }
    
    @GetMapping("/user-dashboard")
    public String userDashboard() {
        return "user-dashboard";
    }
    
    @GetMapping("/admin-dashboard")
    public String adminDashboard() {
        return "admin-dashboard";
    }
}
