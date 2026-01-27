package com.applyfollow.backend.controller;

import com.applyfollow.backend.dto.AuthResponse;
import com.applyfollow.backend.dto.ChangePasswordRequest;
import com.applyfollow.backend.dto.UpdateProfileRequest;
import com.applyfollow.backend.dto.UserResponse;
import com.applyfollow.backend.service.UserService;
import jakarta.validation.Valid;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.web.PageableDefault;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.*;

import com.applyfollow.backend.model.User;

@RestController
@RequestMapping("/api/users")
public class UserController {

    private final UserService userService;

    public UserController(UserService userService) {
        this.userService = userService;
    }

    @GetMapping
    public Page<UserResponse> getAllUsers(@PageableDefault(size = 20) Pageable pageable) {
        return userService.getAllUsers(pageable);
    }

    @GetMapping("/profile")
    public AuthResponse getProfile(org.springframework.security.core.Authentication authentication) {
        User user = (User) authentication.getPrincipal();
        return userService.getProfile(user.getId());
    }

    @GetMapping("/me")
    public AuthResponse getCurrentUser(org.springframework.security.core.Authentication authentication) {
        return getProfile(authentication);
    }

    @PutMapping("/profile")
    public AuthResponse updateProfile(
            org.springframework.security.core.Authentication authentication,
            @RequestBody @Valid UpdateProfileRequest request) {
        User user = (User) authentication.getPrincipal();
        return userService.updateProfile(user.getId(), request);
    }

    @PostMapping("/change-password")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    public void changePassword(
            org.springframework.security.core.Authentication authentication,
            @RequestBody @Valid ChangePasswordRequest request) {
        User user = (User) authentication.getPrincipal();
        userService.changePassword(user.getId(), request);
    }
}
