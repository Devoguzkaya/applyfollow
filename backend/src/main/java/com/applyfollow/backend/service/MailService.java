package com.applyfollow.backend.service;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
@Slf4j
public class MailService {

    private final JavaMailSender mailSender;

    public void sendEmail(String to, String subject, String body) {
        try {
            // Temporarily disabled for production stability until SMTP is configured
            log.info("[MOCK] Would have sent email to: {} with subject: {}", to, subject);

            /*
             * SimpleMailMessage message = new SimpleMailMessage();
             * message.setFrom("applyfollow.noreply@gmail.com");
             * message.setTo(to);
             * message.setSubject(subject);
             * message.setText(body);
             * mailSender.send(message);
             * log.info("Email sent to: {}", to);
             */
        } catch (Exception e) {
            log.error("Failed to send email to {}: {}", to, e.getMessage());
        }
    }
}
