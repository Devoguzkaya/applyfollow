package com.applytrack.backend.service;

import com.applytrack.backend.dto.CalendarEventRequest;
import com.applytrack.backend.dto.CalendarEventResponse;
import com.applytrack.backend.exception.ResourceNotFoundException;
import com.applytrack.backend.model.CalendarEvent;
import com.applytrack.backend.model.User;
import com.applytrack.backend.repository.CalendarEventRepository;
import com.applytrack.backend.repository.UserRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.time.LocalDate;
import java.time.LocalTime;
import java.util.List;
import java.util.Optional;
import java.util.UUID;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class CalendarEventServiceTest {

    @Mock
    private CalendarEventRepository repository;
    @Mock
    private UserRepository userRepository;

    @InjectMocks
    private CalendarEventService service;

    private User user;
    private CalendarEvent event;

    @BeforeEach
    void setUp() {
        user = User.builder().id(UUID.randomUUID()).email("cal@test.com").build();

        event = new CalendarEvent();
        event.setId(UUID.randomUUID());
        event.setTitle("Interview");
        event.setDate(LocalDate.now());
        event.setUser(user);
    }

    @Test
    void getAllEvents_ShouldReturnUserEvents() {
        when(repository.findAllByUserId(user.getId())).thenReturn(List.of(event));

        List<CalendarEventResponse> result = service.getAllEvents(user.getId());

        assertEquals(1, result.size());
        assertEquals("Interview", result.get(0).title());
    }

    @Test
    void createEvent_ShouldSaveAndReturn() {
        CalendarEventRequest request = new CalendarEventRequest(
                "Meeting", LocalDate.now(), LocalTime.NOON, "MEETING", "Notes", false, null);

        when(userRepository.findById(user.getId())).thenReturn(Optional.of(user));
        when(repository.save(any(CalendarEvent.class))).thenReturn(event); // Mock return doesn't strictly match request
                                                                           // but validates flow

        CalendarEventResponse result = service.createEvent(request, user.getId());

        assertNotNull(result);
        verify(repository).save(any(CalendarEvent.class));
    }

    @Test
    void deleteEvent_WhenUserOwnsEvent_ShouldDelete() {
        when(repository.findById(event.getId())).thenReturn(Optional.of(event));

        service.deleteEvent(event.getId(), user.getId());

        verify(repository).delete(event);
    }

    @Test
    void deleteEvent_WhenUserDoesNotOwnEvent_ShouldThrowException() {
        User otherUser = User.builder().id(UUID.randomUUID()).build();
        event.setUser(otherUser);

        when(repository.findById(event.getId())).thenReturn(Optional.of(event));

        assertThrows(ResourceNotFoundException.class, () -> service.deleteEvent(event.getId(), user.getId()));
        verify(repository, never()).delete(any());
    }
}
