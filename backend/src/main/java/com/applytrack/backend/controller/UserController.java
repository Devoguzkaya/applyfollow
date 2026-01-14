package com.applytrack.backend.controller;

import com.applytrack.backend.dto.AuthResponse;
import com.applytrack.backend.dto.ChangePasswordRequest;
import com.applytrack.backend.dto.UpdateProfileRequest;
import com.applytrack.backend.dto.UserResponse;
import com.applytrack.backend.service.UserService;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/api/users")
@CrossOrigin(origins = "http://localhost:3000") // CORS handled in SecurityConfig as well but explicit is fine
public class UserController {

    private final UserService userService;

    public UserController(UserService userService) {
        this.userService = userService;
    }

    @GetMapping
    public List<UserResponse> getAllUsers() {
        return userService.getAllUsers();
    }

    @PutMapping("/profile")
    public AuthResponse updateProfile(
            @RequestHeader("X-User-Id") UUID userId,
            @RequestBody @Valid UpdateProfileRequest request) {
        return userService.updateProfile(userId, request);
    }

    @PostMapping("/change-password")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    public void changePassword(
            @RequestHeader("X-User-Id") UUID userId,
            @RequestBody @Valid ChangePasswordRequest request) {
        userService.changePassword(userId, request);
    }
}
