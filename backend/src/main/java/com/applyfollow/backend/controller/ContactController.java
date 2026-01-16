package com.applyfollow.backend.controller;

import com.applyfollow.backend.dto.ContactMessageRequest;
import com.applyfollow.backend.service.MailService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/contact")
@RequiredArgsConstructor
@org.springframework.web.bind.annotation.CrossOrigin(origins = "http://localhost:3000")
public class ContactController {

    private final com.applyfollow.backend.repository.ContactMessageRepository contactMessageRepository;

    @PostMapping
    public ResponseEntity<Void> sendContactMessage(@Valid @RequestBody ContactMessageRequest request) {
        com.applyfollow.backend.model.ContactMessage message = new com.applyfollow.backend.model.ContactMessage();
        message.setName(request.name());
        message.setEmail(request.email());
        message.setSubject(request.subject());
        message.setMessage(request.message());
        message.setReplied(false);
        message.setCreatedAt(java.time.LocalDateTime.now());

        contactMessageRepository.save(message);

        return ResponseEntity.ok().build();
    }
}

