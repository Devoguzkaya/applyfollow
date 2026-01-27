package com.applyfollow.backend.controller;

import com.applyfollow.backend.dto.CalendarEventRequest;
import com.applyfollow.backend.dto.CalendarEventResponse;
import com.applyfollow.backend.model.User;
import com.applyfollow.backend.service.CalendarEventService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/api/calendar")
@RequiredArgsConstructor
public class CalendarEventController {

    private final CalendarEventService service;

    @GetMapping
    public List<CalendarEventResponse> getAllEvents(@AuthenticationPrincipal UserDetails userDetails) {
        User user = (User) userDetails;
        return service.getAllEvents(user.getId());
    }

    @PostMapping
    @ResponseStatus(HttpStatus.CREATED)
    public CalendarEventResponse createEvent(
            @Valid @RequestBody CalendarEventRequest request,
            @AuthenticationPrincipal UserDetails userDetails) {
        User user = (User) userDetails;
        return service.createEvent(request, user.getId());
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteEvent(
            @PathVariable UUID id,
            @AuthenticationPrincipal UserDetails userDetails) {
        User user = (User) userDetails;
        service.deleteEvent(id, user.getId());
        return ResponseEntity.noContent().build();
    }
}
