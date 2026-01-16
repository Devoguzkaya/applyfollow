package com.applyfollow.backend.dto;

import com.applyfollow.backend.model.ApplicationStatus;
import java.time.LocalDateTime;
import java.util.UUID;

public record ApplicationResponse(
                UUID id,
                CompanyResponse company,
                String position,
                ApplicationStatus status,
                String jobUrl,
                String notes,
                LocalDateTime appliedAt) {
}

