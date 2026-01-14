package com.applytrack.backend.service;

import com.applytrack.backend.dto.CalendarEventRequest;
import com.applytrack.backend.dto.CalendarEventResponse;
import com.applytrack.backend.exception.ResourceNotFoundException;
import com.applytrack.backend.model.CalendarEvent;
import com.applytrack.backend.model.User;
import com.applytrack.backend.repository.CalendarEventRepository;
import com.applytrack.backend.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.UUID;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class CalendarEventService {

    private final CalendarEventRepository repository;
    private final UserRepository userRepository;

    public List<CalendarEventResponse> getAllEvents(UUID userId) {
        return repository.findAllByUserId(userId).stream()
                .map(this::mapToResponse)
                .collect(Collectors.toList());
    }

    @Transactional
    public CalendarEventResponse createEvent(CalendarEventRequest request, UUID userId) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new ResourceNotFoundException("User not found"));

        CalendarEvent event = new CalendarEvent();
        event.setTitle(request.title());
        event.setDate(request.date());
        event.setTime(request.time());
        event.setType(request.type());
        event.setNotes(request.notes());
        event.setHasAlarm(request.hasAlarm());
        event.setAlarmTime(request.alarmTime());
        event.setUser(user);

        CalendarEvent savedEvent = repository.save(event);
        return mapToResponse(savedEvent);
    }

    @Transactional
    public void deleteEvent(UUID id, UUID userId) {
        CalendarEvent event = repository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Event not found"));

        // Security check: ensure the event belongs to the user
        if (!event.getUser().getId().equals(userId)) {
            throw new ResourceNotFoundException("Event not found"); // Hide existence
        }

        repository.delete(event);
    }

    private CalendarEventResponse mapToResponse(CalendarEvent event) {
        return new CalendarEventResponse(
                event.getId(),
                event.getTitle(),
                event.getDate(),
                event.getTime(),
                event.getType(),
                event.getNotes(),
                event.isHasAlarm(),
                event.getAlarmTime());
    }
}
