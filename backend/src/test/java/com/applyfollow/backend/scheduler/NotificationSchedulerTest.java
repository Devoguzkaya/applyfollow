package com.applyfollow.backend.scheduler;

import com.applyfollow.backend.model.CalendarEvent;
import com.applyfollow.backend.repository.CalendarEventRepository;
import com.applyfollow.backend.service.MailService;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.util.List;

import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class NotificationSchedulerTest {

    @Mock
    private CalendarEventRepository eventRepository;

    @Mock
    private MailService mailService;

    @InjectMocks
    private NotificationScheduler scheduler;

    @Test
    void sendEventReminders_WhenNoAlarmsExist_ShouldNotQueryDatabase() {
        // hasPendingAlarms is false by default in mock testing unless init() is
        // triggered

        scheduler.sendEventReminders();

        // Verify findEventsToNotify is never called
        verify(eventRepository, never()).findEventsToNotify(any(), any(), any());
    }

    @Test
    void sendEventReminders_WhenTriggered_ShouldQueryDatabase() {
        // Trigger the smart polling bayrağını kaldır
        scheduler.triggerCheck();

        when(eventRepository.findEventsToNotify(any(), any(), any())).thenReturn(List.of());

        scheduler.sendEventReminders();

        // Verify findEventsToNotify IS called this time
        verify(eventRepository).findEventsToNotify(any(), any(), any());
    }

    @Test
    void init_ShouldSetInitialStateBasedOnDatabase() {
        when(eventRepository.existsByHasAlarmTrueAndNotifiedFalse()).thenReturn(true);

        scheduler.init();

        // After init(true), it should query DB
        scheduler.sendEventReminders();
        verify(eventRepository).findEventsToNotify(any(), any(), any());
    }
}
