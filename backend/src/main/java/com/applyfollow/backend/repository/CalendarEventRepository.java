package com.applyfollow.backend.repository;

import com.applyfollow.backend.model.CalendarEvent;
import org.springframework.data.jpa.repository.JpaRepository;
import java.time.LocalDate;
import java.time.LocalTime;
import java.util.List;
import java.util.UUID;

public interface CalendarEventRepository extends JpaRepository<CalendarEvent, UUID> {
    List<CalendarEvent> findAllByUserId(UUID userId);

    @org.springframework.data.jpa.repository.Query("SELECT e FROM CalendarEvent e JOIN FETCH e.user " +
            "WHERE e.hasAlarm = true AND e.notified = false AND " +
            "(e.date < :d1 OR (e.date = :d2 AND e.alarmTime <= :t2))")
    List<CalendarEvent> findEventsToNotify(LocalDate d1, LocalDate d2, LocalTime t2);
}
