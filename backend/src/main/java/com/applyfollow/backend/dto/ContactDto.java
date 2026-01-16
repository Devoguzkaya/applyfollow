package com.applyfollow.backend.dto;

public record ContactDto(
        java.util.UUID id,
        String name,
        String role,
        String email,
        String phone,
        String linkedIn) {
}

