package com.applyfollow.backend.controller;

import com.applyfollow.backend.dto.CalendarEventRequest;
import com.applyfollow.backend.dto.CalendarEventResponse;
import com.applyfollow.backend.model.Role;
import com.applyfollow.backend.model.User;
import com.applyfollow.backend.service.CalendarEventService;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.boot.test.mock.mockito.MockBean;
import org.springframework.http.MediaType;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.test.web.servlet.MockMvc;

import java.time.LocalDate;
import java.time.LocalTime;
import java.util.Collections;
import java.util.UUID;

import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.eq;
import static org.mockito.Mockito.doNothing;
import static org.mockito.Mockito.when;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

@SpringBootTest
@AutoConfigureMockMvc
public class CalendarEventControllerTest {

    @Autowired
    private MockMvc mockMvc;

    @Autowired
    private ObjectMapper objectMapper;

    @MockBean
    private CalendarEventService service;

    private User mockUser;

    @BeforeEach
    void setUp() {
        mockUser = User.builder()
                .id(UUID.randomUUID())
                .email("test@calendar.com")
                .fullName("Calendar User")
                .role(Role.USER)
                .build();

        UsernamePasswordAuthenticationToken authentication = new UsernamePasswordAuthenticationToken(
                mockUser, null, mockUser.getAuthorities());
        SecurityContextHolder.getContext().setAuthentication(authentication);
    }

    @Test
    public void getAllEvents_ShouldReturnList() throws Exception {
        CalendarEventResponse response = new CalendarEventResponse(
                UUID.randomUUID(), "Interview", LocalDate.now(), LocalTime.NOON, "INTERVIEW", "Notes", false, null);

        when(service.getAllEvents(any(UUID.class))).thenReturn(Collections.singletonList(response));

        mockMvc.perform(get("/api/calendar"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$[0].title").value("Interview"));
    }

    @Test
    public void createEvent_ShouldReturnCreatedEvent() throws Exception {
        CalendarEventRequest request = new CalendarEventRequest(
                "New Event", LocalDate.now(), LocalTime.NOON, "Meeting", "Desc", true, LocalTime.of(10, 0));

        CalendarEventResponse response = new CalendarEventResponse(
                UUID.randomUUID(), "New Event", LocalDate.now(), LocalTime.NOON, "Meeting", "Desc", true,
                LocalTime.of(10, 0));

        when(service.createEvent(any(CalendarEventRequest.class), any(UUID.class))).thenReturn(response);

        mockMvc.perform(post("/api/calendar")
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(request)))
                .andExpect(status().isCreated())
                .andExpect(jsonPath("$.title").value("New Event"));
    }

    @Test
    public void deleteEvent_ShouldReturnNoContent() throws Exception {
        UUID eventId = UUID.randomUUID();
        doNothing().when(service).deleteEvent(eq(eventId), any(UUID.class));

        mockMvc.perform(delete("/api/calendar/" + eventId))
                .andExpect(status().isNoContent());
    }
}

