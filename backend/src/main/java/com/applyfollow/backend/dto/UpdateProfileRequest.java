package com.applyfollow.backend.dto;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;

public record UpdateProfileRequest(
                @NotBlank(message = "Full name is required") String fullName,

                @Email(message = "Invalid email format") String email,
                String phoneNumber,
                String address,
                String linkedinUrl,
                String githubUrl,
                String websiteUrl,
                String summary) {
}
