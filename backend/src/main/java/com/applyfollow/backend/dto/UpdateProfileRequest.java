package com.applyfollow.backend.dto;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;

public record UpdateProfileRequest(
        @NotBlank(message = "Full name is required") String fullName,

        @Email(message = "Invalid email format") String email) {
}

