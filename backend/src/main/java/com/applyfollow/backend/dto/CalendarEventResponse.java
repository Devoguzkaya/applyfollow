package com.applyfollow.backend.dto;

import java.time.LocalDate;
import java.time.LocalTime;
import java.util.UUID;

public record CalendarEventResponse(
        UUID id,
        String title,
        LocalDate date,
        LocalTime time,
        String type,
        String notes,
        boolean hasAlarm,
        LocalTime alarmTime) {
}

