package com.applyfollow.backend.dto;

import java.util.UUID;

public record AuthResponse(
                String token,
                UUID id,
                String email,
                String fullName,
                String role,
                String message,
                String phoneNumber,
                String address,
                String linkedinUrl,
                String githubUrl,
                String websiteUrl,
                String summary) {
}
