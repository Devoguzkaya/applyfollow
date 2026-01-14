package com.applytrack.backend.dto;

public record ContactDto(
        java.util.UUID id,
        String name,
        String role,
        String email,
        String phone,
        String linkedIn) {
}
