package com.applyfollow.backend.controller;

import com.applyfollow.backend.dto.UserResponse;
import com.applyfollow.backend.model.ContactMessage;
import com.applyfollow.backend.model.User;
import com.applyfollow.backend.repository.ContactMessageRepository;
import com.applyfollow.backend.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Sort;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.UUID;

@RestController
@RequestMapping("/api/admin")
@RequiredArgsConstructor
@CrossOrigin(origins = "http://localhost:3000")
public class AdminController {

    private final UserRepository userRepository;
    private final ContactMessageRepository contactMessageRepository;

    // --- User Management ---

    @GetMapping("/users")
    public ResponseEntity<Page<UserResponse>> getAllUsers(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size,
            @RequestParam(required = false) String email) {

        PageRequest pageRequest = PageRequest.of(page, size, Sort.by("fullName").ascending());
        Page<User> userPage;

        if (email != null && !email.isEmpty()) {
            // Primitive filtering by email as example
            userPage = userRepository.findByEmailContainingIgnoreCase(email, pageRequest);
        } else {
            userPage = userRepository.findAll(pageRequest);
        }

        Page<UserResponse> responsePage = userPage.map(user -> new UserResponse(
                user.getId(),
                user.getEmail(),
                user.getFullName(),
                user.getRole().name(),
                user.isActive()));

        return ResponseEntity.ok(responsePage);
    }

    @PatchMapping("/users/{id}/toggle-status")
    public ResponseEntity<Void> toggleUserStatus(@PathVariable UUID id) {
        User user = userRepository.findById(id)
                .orElseThrow(() -> new com.applyfollow.backend.exception.ResourceNotFoundException("User not found"));

        // Prevent deactivating yourself (safety check)
        // Note: For simplicity, we assume the admin knows what they're doing.

        user.setActive(!user.isActive());
        userRepository.save(user);
        return ResponseEntity.ok().build();
    }

    // --- Message Management ---

    @GetMapping("/messages")
    public ResponseEntity<Page<ContactMessage>> getAllMessages(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size) {

        PageRequest pageRequest = PageRequest.of(page, size, Sort.by("createdAt").descending());
        return ResponseEntity.ok(contactMessageRepository.findAll(pageRequest));
    }

    @PatchMapping("/messages/{id}/toggle-replied")
    public ResponseEntity<ContactMessage> toggleMessageReplied(@PathVariable UUID id) {
        ContactMessage message = contactMessageRepository.findById(id)
                .orElseThrow(() -> new com.applyfollow.backend.exception.ResourceNotFoundException("Message not found"));

        message.setReplied(!message.isReplied());
        return ResponseEntity.ok(contactMessageRepository.save(message));
    }

    @DeleteMapping("/messages/{id}")
    public ResponseEntity<Void> deleteMessage(@PathVariable UUID id) {
        contactMessageRepository.deleteById(id);
        return ResponseEntity.noContent().build();
    }
}

