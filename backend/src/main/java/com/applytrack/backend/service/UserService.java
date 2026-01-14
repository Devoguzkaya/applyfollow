package com.applytrack.backend.service;

import com.applytrack.backend.config.JwtService;
import com.applytrack.backend.dto.AuthResponse;
import com.applytrack.backend.dto.LoginRequest;
import com.applytrack.backend.dto.RegisterRequest;
import com.applytrack.backend.dto.UpdateProfileRequest;
import com.applytrack.backend.dto.ChangePasswordRequest;
import com.applytrack.backend.dto.UserResponse;
import com.applytrack.backend.exception.BadRequestException;
import com.applytrack.backend.exception.ResourceNotFoundException;
import com.applytrack.backend.model.Role;
import com.applytrack.backend.model.User;
import com.applytrack.backend.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.UUID;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class UserService {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtService jwtService;
    private final AuthenticationManager authenticationManager;

    public AuthResponse register(RegisterRequest request) {
        if (userRepository.findByEmail(request.email()).isPresent()) {
            throw new BadRequestException("Email already in use");
        }
        var user = User.builder()
                .fullName(request.fullName())
                .email(request.email())
                .passwordHash(passwordEncoder.encode(request.password()))
                .role(Role.USER)
                .build();

        userRepository.save(user);
        var jwtToken = jwtService.generateToken(user);

        return new AuthResponse(jwtToken, user.getId(), user.getEmail(), user.getFullName(),
                "User registered successfully");
    }

    public AuthResponse login(LoginRequest request) {
        authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(request.email(), request.password()));
        var user = userRepository.findByEmail(request.email())
                .orElseThrow(() -> new ResourceNotFoundException("User not found"));

        var jwtToken = jwtService.generateToken(user);

        return new AuthResponse(jwtToken, user.getId(), user.getEmail(), user.getFullName(), "Login successful");
    }

    public List<UserResponse> getAllUsers() {
        return userRepository.findAll().stream()
                .map(user -> new UserResponse(user.getId(), user.getEmail(), user.getFullName()))
                .collect(Collectors.toList());
    }

    public AuthResponse updateProfile(UUID userId, UpdateProfileRequest request) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new ResourceNotFoundException("User not found"));

        user.setFullName(request.fullName());

        if (request.email() != null && !request.email().isEmpty() && !request.email().equals(user.getEmail())) {
            if (userRepository.findByEmail(request.email()).isPresent()) {
                throw new BadRequestException("Email already in use");
            }
            user.setEmail(request.email());
        }

        userRepository.save(user);
        // Not regenerating token on profile update for simplicity
        return new AuthResponse(null, user.getId(), user.getEmail(), user.getFullName(), "Profile updated");
    }

    public void changePassword(UUID userId, ChangePasswordRequest request) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new ResourceNotFoundException("User not found"));

        if (!passwordEncoder.matches(request.currentPassword(), user.getPasswordHash())) {
            throw new BadRequestException("Invalid current password");
        }

        user.setPasswordHash(passwordEncoder.encode(request.newPassword()));
        userRepository.save(user);
    }
}
