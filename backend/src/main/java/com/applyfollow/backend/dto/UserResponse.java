package com.applyfollow.backend.dto;

import java.util.UUID;

public record UserResponse(
                UUID id,
                String email,
                String fullName,
                String role,
                boolean active) {
}

