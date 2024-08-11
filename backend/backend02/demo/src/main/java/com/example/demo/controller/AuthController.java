package com.example.demo.controller;

import static org.springframework.http.HttpStatus.*;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RestController;

import com.example.demo.dto.request.LoginRequest;
import com.example.demo.dto.request.RegisterRequest;
import com.example.demo.dto.response.LoginResponse;
import com.example.demo.service.AuthService;

import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.Parameter;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;

@RestController
@RequiredArgsConstructor
@Tag(name = "Authentication", description = "Endpoints for user authentication")
public class AuthController {

    private final AuthService authService;

    @CrossOrigin(origins = "http://localhost:3000")
    @PostMapping("/api/auth/register")
    @Operation(summary = "Register a new user", description = "Allows users to register by providing necessary registration details.")
    public ResponseEntity<?> register(@Parameter(description = "Registration details of the user") @RequestBody RegisterRequest registerRequest) {
        try {
            String result = authService.register(registerRequest);
            return new ResponseEntity<>(result, CREATED); // Return 201 Created for successful registration
        } catch (Exception e) {
            return new ResponseEntity<>(e.getMessage(), BAD_REQUEST); // Return 400 Bad Request for errors
        }
    }

    @CrossOrigin(origins = "http://localhost:3000")
    @PostMapping("/api/auth/login")
    @Operation(summary = "Authenticate user", description = "Allows users to authenticate by providing valid login credentials.")
    public ResponseEntity<?> login(@Parameter(description = "Login credentials of the user") @RequestBody LoginRequest loginRequest) {
        try {
            LoginResponse response = authService.login(loginRequest);
            return new ResponseEntity<>(response, OK);
        } catch (Exception e) {
            return new ResponseEntity<>(e.getMessage(), UNAUTHORIZED); // Return 401 Unauthorized for login failures
        }
    }
}
