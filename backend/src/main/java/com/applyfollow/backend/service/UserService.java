package com.applyfollow.backend.service;

import com.applyfollow.backend.config.JwtService;
import com.applyfollow.backend.dto.AuthResponse;
import com.applyfollow.backend.dto.LoginRequest;
import com.applyfollow.backend.dto.RegisterRequest;
import com.applyfollow.backend.dto.UpdateProfileRequest;
import com.applyfollow.backend.dto.ChangePasswordRequest;
import com.applyfollow.backend.dto.UserResponse;
import com.applyfollow.backend.exception.BadRequestException;
import com.applyfollow.backend.exception.ResourceNotFoundException;
import com.applyfollow.backend.model.Role;
import com.applyfollow.backend.model.User;
import com.applyfollow.backend.repository.UserRepository;
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

        Role role = Role.USER;

        var user = User.builder()
                .fullName(request.fullName())
                .email(request.email())
                .passwordHash(passwordEncoder.encode(request.password()))
                .role(role)
                .role(role)
                .active(true)
                .marketDataConsent(request.marketDataConsent())
                .build();

        userRepository.save(user);
        var jwtToken = jwtService.generateToken(user);

        return new AuthResponse(jwtToken, user.getId(), user.getEmail(), user.getFullName(), user.getRole().name(),
                "User registered successfully", user.getPhoneNumber(), user.getAddress(), user.getLinkedinUrl(),
                user.getGithubUrl(), user.getWebsiteUrl(), user.getSummary());
    }

    public AuthResponse login(LoginRequest request) {
        var user = userRepository.findByEmail(request.email())
                .orElseThrow(() -> new ResourceNotFoundException("User not found"));

        if (!user.isActive()) {
            throw new BadRequestException("Hesabınız askıya alınmıştır aktifleştirmek için iletişime geçin");
        }

        authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(request.email(), request.password()));

        var jwtToken = jwtService.generateToken(user);

        return new AuthResponse(jwtToken, user.getId(), user.getEmail(), user.getFullName(), user.getRole().name(),
                "Login successful", user.getPhoneNumber(), user.getAddress(), user.getLinkedinUrl(),
                user.getGithubUrl(), user.getWebsiteUrl(), user.getSummary());
    }

    public List<UserResponse> getAllUsers() {
        return userRepository.findAll().stream()
                .map(user -> new UserResponse(user.getId(), user.getEmail(), user.getFullName(), user.getRole().name(),
                        user.isActive()))
                .collect(Collectors.toList());
    }

    public AuthResponse updateProfile(UUID userId, UpdateProfileRequest request) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new ResourceNotFoundException("User not found"));

        user.setFullName(request.fullName());
        user.setPhoneNumber(request.phoneNumber());
        user.setAddress(request.address());
        user.setLinkedinUrl(request.linkedinUrl());
        user.setGithubUrl(request.githubUrl());
        user.setWebsiteUrl(request.websiteUrl());
        user.setSummary(request.summary());

        if (request.email() != null && !request.email().isEmpty() && !request.email().equals(user.getEmail())) {
            if (userRepository.findByEmail(request.email()).isPresent()) {
                throw new BadRequestException("Email already in use");
            }
            user.setEmail(request.email());
        }

        userRepository.save(user);
        // Not regenerating token on profile update for simplicity
        return new AuthResponse(null, user.getId(), user.getEmail(), user.getFullName(), user.getRole().name(),
                "Profile updated", user.getPhoneNumber(), user.getAddress(), user.getLinkedinUrl(),
                user.getGithubUrl(), user.getWebsiteUrl(), user.getSummary());
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

    public AuthResponse getProfile(UUID userId) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new ResourceNotFoundException("User not found"));

        return new AuthResponse(null, user.getId(), user.getEmail(), user.getFullName(), user.getRole().name(),
                "Profile fetched", user.getPhoneNumber(), user.getAddress(), user.getLinkedinUrl(),
                user.getGithubUrl(), user.getWebsiteUrl(), user.getSummary());
    }
}
