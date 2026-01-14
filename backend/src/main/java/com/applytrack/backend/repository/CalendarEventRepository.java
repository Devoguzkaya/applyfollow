package com.applytrack.backend.repository;

import com.applytrack.backend.model.CalendarEvent;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;
import java.util.UUID;

public interface CalendarEventRepository extends JpaRepository<CalendarEvent, UUID> {
    List<CalendarEvent> findAllByUserId(UUID userId);
}
