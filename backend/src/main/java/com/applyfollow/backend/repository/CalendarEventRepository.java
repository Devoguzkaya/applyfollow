package com.applyfollow.backend.repository;

import com.applyfollow.backend.model.CalendarEvent;
import org.springframework.data.jpa.repository.JpaRepository;
import java.time.LocalDate;
import java.time.LocalTime;
import java.util.List;
import java.util.UUID;

public interface CalendarEventRepository extends JpaRepository<CalendarEvent, UUID> {
    List<CalendarEvent> findAllByUserId(UUID userId);

    List<CalendarEvent> findAllByHasAlarmTrueAndNotifiedFalseAndDateBeforeOrDateEqualsAndAlarmTimeBeforeOrAlarmTimeEquals(
            LocalDate d1, LocalDate d2, LocalTime t1, LocalTime t2);
}

