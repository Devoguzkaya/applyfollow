package com.applyfollow.backend.scheduler;

import com.applyfollow.backend.model.CalendarEvent;
import com.applyfollow.backend.repository.CalendarEventRepository;
import com.applyfollow.backend.service.MailService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Component;

import java.time.LocalDate;
import java.time.LocalTime;
import java.util.List;

@Component
@RequiredArgsConstructor
@Slf4j
public class NotificationScheduler {

    private final CalendarEventRepository eventRepository;
    private final MailService mailService;

    // Runs every minute
    @Scheduled(fixedRate = 60000)
    public void sendEventReminders() {
        LocalDate today = LocalDate.now();
        LocalTime now = LocalTime.now();

        List<CalendarEvent> eventsToNotify = eventRepository.findEventsToNotify(today, today, now);

        if (eventsToNotify.isEmpty()) {
            return;
        }

        log.info("Found {} events to notify", eventsToNotify.size());

        for (CalendarEvent event : eventsToNotify) {
            String userEmail = event.getUser().getEmail();
            String subject = "ApplyFollow Reminder: " + event.getTitle();
            String body = String.format(
                    "Hello %s,\n\nYou have an upcoming event: %s\nDate: %s\nTime: %s\nNotes: %s\n\nGood luck!",
                    event.getUser().getFullName(),
                    event.getTitle(),
                    event.getDate(),
                    event.getTime(),
                    event.getNotes() != null ? event.getNotes() : "No notes");

            mailService.sendEmail(userEmail, subject, body);
            event.setNotified(true);
        }

        // Batch save all notified events
        eventRepository.saveAll(eventsToNotify);
    }
}
