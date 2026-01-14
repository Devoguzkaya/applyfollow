package com.applytrack.backend.dto;

import com.applytrack.backend.model.ApplicationStatus;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;

public record ApplicationRequest(
        @NotBlank(message = "Company name cannot be empty") String companyName,

        @NotBlank(message = "Position cannot be empty") String position,

        @NotNull(message = "Status is required") ApplicationStatus status,

        String jobUrl,
        String notes) {
}
