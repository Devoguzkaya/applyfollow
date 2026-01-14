package com.applytrack.backend.dto;

import java.time.LocalDateTime;
import java.util.UUID;

public record CompanyResponse(
        UUID id,
        String name,
        String website,
        String linkedinUrl,
        String logoUrl,
        LocalDateTime createdAt) {
}
