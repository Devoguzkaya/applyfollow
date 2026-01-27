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
import java.util.concurrent.atomic.AtomicBoolean;

@Component
@RequiredArgsConstructor
@Slf4j
public class NotificationScheduler {

    private final CalendarEventRepository eventRepository;
    private final MailService mailService;

    // "Akıllı State": Veritabanına gitmeden önce bellekte bekleyen alarm var mı
    // kontrol eder
    private final AtomicBoolean hasPendingAlarms = new AtomicBoolean(false);

    @jakarta.annotation.PostConstruct
    public void init() {
        // Uygulama başlarken veritabanında bekleyen alarm (notified=false) var mı bak
        boolean exists = eventRepository.existsByHasAlarmTrueAndNotifiedFalse();
        hasPendingAlarms.set(exists);
        log.info("Notification system initialized. Pending alarms exists: {}", exists);
    }

    public void triggerCheck() {
        hasPendingAlarms.set(true);
    }

    // Runs every minute
    @Scheduled(fixedRate = 60000)
    public void sendEventReminders() {
        if (!hasPendingAlarms.get()) {
            return; // Hiç alarm yoksa veritabanına sorgu atma
        }

        LocalDate today = LocalDate.now();
        LocalTime now = LocalTime.now();

        List<CalendarEvent> eventsToNotify = eventRepository.findEventsToNotify(today, today, now);

        if (eventsToNotify.isEmpty()) {
            // Hiç bildirim saati gelmiş etkinlik yoksa, genel olarak bekleyen alarm kalmış
            // mı kontrol et
            if (!eventRepository.existsByHasAlarmTrueAndNotifiedFalse()) {
                hasPendingAlarms.set(false);
            }
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

        // İşlem sonrası bekleyen alarm kalmadıysa flag'i indir
        if (!eventRepository.existsByHasAlarmTrueAndNotifiedFalse()) {
            hasPendingAlarms.set(false);
            log.info("All pending alarms processed. Cooling down scheduler.");
        }
    }
}
