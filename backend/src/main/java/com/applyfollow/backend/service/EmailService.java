package com.applyfollow.backend.service;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpEntity;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

@Service
public class EmailService {

    @Value("${resend.api.key}")
    private String resendApiKey;

    @Value("${app.frontend.url}")
    private String frontendUrls; // Could contain multiple comma-separated, taking first

    public void sendPasswordResetEmail(String toEmail, String token) {
        String baseUrl = frontendUrls.contains(",") ? frontendUrls.split(",")[0] : frontendUrls;
        String resetUrl = baseUrl + "/reset-password?token=" + token;

        String htmlBody = "<html><body style=\"font-family: Arial, sans-serif; background-color: #f4f4f5; padding: 20px;\">"
                +
                "<div style=\"max-width: 600px; margin: 0 auto; background-color: #ffffff; padding: 30px; border-radius: 8px; box-shadow: 0 4px 6px rgba(0,0,0,0.1);\">"
                +
                "<h2 style=\"color: #0f172a; margin-top: 0;\">Reset Your Password</h2>" +
                "<p style=\"color: #475569; font-size: 16px; line-height: 1.5;\">You recently requested to reset your password for your ApplyFollow account. Click the button below to reset it.</p>"
                +
                "<div style=\"text-align: center; margin: 30px 0;\">" +
                "<a href=\"" + resetUrl
                + "\" style=\"display: inline-block; padding: 12px 24px; font-size: 16px; font-weight: bold; color: #ffffff; background-color: #10b981; text-decoration: none; border-radius: 6px;\">Reset Password</a>"
                +
                "</div>" +
                "<p style=\"color: #64748b; font-size: 14px;\">If you didn't request this, please ignore this email.</p>"
                +
                "<p style=\"color: #64748b; font-size: 14px;\">This link will expire in 1 hour.</p>" +
                "</div>" +
                "</body></html>";

        String url = "https://api.resend.com/emails";

        HttpHeaders headers = new HttpHeaders();
        headers.setContentType(MediaType.APPLICATION_JSON);
        headers.setBearerAuth(resendApiKey);

        Map<String, Object> body = new HashMap<>();
        body.put("from", "ApplyFollow <noreply@applyfollow.com>");
        body.put("to", List.of(toEmail));
        body.put("subject", "Reset Your ApplyFollow Password");
        body.put("html", htmlBody);

        HttpEntity<Map<String, Object>> request = new HttpEntity<>(body, headers);
        RestTemplate restTemplate = new RestTemplate();

        try {
            restTemplate.postForEntity(url, request, String.class);
        } catch (Exception e) {
            System.err.println("Failed to send email via Resend API: " + e.getMessage());
        }
    }
}
