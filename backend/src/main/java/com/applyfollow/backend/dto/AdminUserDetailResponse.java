package com.applyfollow.backend.dto;

import java.util.UUID;

public record AdminUserDetailResponse(
        UUID id,
        String email,
        String fullName,
        String role,
        boolean active,
        String phoneNumber,
        String address,
        String linkedinUrl,
        String githubUrl,
        String websiteUrl,
        String summary) {
}
