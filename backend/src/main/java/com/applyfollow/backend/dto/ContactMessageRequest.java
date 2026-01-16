package com.applyfollow.backend.dto;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;

public record ContactMessageRequest(
        @NotBlank(message = "Name is required") String name,
        @Email(message = "Invalid email") @NotBlank(message = "Email is required") String email,
        @NotBlank(message = "Subject is required") String subject,
        @NotBlank(message = "Message is required") String message) {
}

