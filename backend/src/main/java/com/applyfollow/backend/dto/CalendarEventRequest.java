package com.applyfollow.backend.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import java.time.LocalDate;
import java.time.LocalTime;

public record CalendarEventRequest(
        @NotBlank(message = "Title is required") String title,

        @NotNull(message = "Date is required") LocalDate date,

        LocalTime time,

        String type,

        String notes,

        boolean hasAlarm,

        LocalTime alarmTime) {
}

