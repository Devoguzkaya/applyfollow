package com.applyfollow.backend.controller;

import com.applyfollow.backend.dto.CvUpdateRequest;
import com.applyfollow.backend.model.User;
import com.applyfollow.backend.service.CvService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.*;

import java.io.IOException;

@RestController
@RequestMapping("/cv")
@RequiredArgsConstructor
public class CvController {

    private final CvService cvService;
    private final com.applyfollow.backend.service.UserService userService; // ID almak icin

    @GetMapping
    public ResponseEntity<CvUpdateRequest> getCv(@AuthenticationPrincipal UserDetails userDetails) {
        User user = (User) userDetails; // Cast to our User model
        return ResponseEntity.ok(cvService.getCv(user.getId()));
    }

    @PostMapping
    public ResponseEntity<Void> updateCv(
            @AuthenticationPrincipal UserDetails userDetails,
            @RequestBody CvUpdateRequest request) {
        User user = (User) userDetails;
        cvService.updateCv(user.getId(), request);
        return ResponseEntity.ok().build();
    }

    @GetMapping("/download")
    public ResponseEntity<byte[]> downloadCv(@AuthenticationPrincipal UserDetails userDetails) throws IOException {
        User user = (User) userDetails;
        byte[] wordContent = cvService.generateWordCv(user.getId());

        String filename = "CV_" + user.getFullName().replaceAll("\\s+", "_") + ".docx";

        return ResponseEntity.ok()
                .header(HttpHeaders.CONTENT_DISPOSITION, "attachment; filename=\"" + filename + "\"")
                .contentType(MediaType.APPLICATION_OCTET_STREAM) // Veya
                                                                 // application/vnd.openxmlformats-officedocument.wordprocessingml.document
                .body(wordContent);
    }

    // Admin endpoint to view user's CV
    @GetMapping("/user/{userId}")
    public ResponseEntity<CvUpdateRequest> getCvByUserId(@PathVariable java.util.UUID userId) {
        return ResponseEntity.ok(cvService.getCv(userId));
    }

    // Admin endpoint to download user's CV
    @GetMapping("/user/{userId}/download")
    public ResponseEntity<byte[]> downloadCvByUserId(@PathVariable java.util.UUID userId) throws IOException {
        // We need to fetch user details to get the name for filename
        // Assuming userService.findById exists or similar mechanism
        // For simplicity, using a generic name or fetching via service layer if
        // possible.
        // Let's use cvService to generate, filename might simple.

        byte[] wordContent = cvService.generateWordCv(userId);
        String filename = "CV_User_" + userId + ".docx";

        return ResponseEntity.ok()
                .header(HttpHeaders.CONTENT_DISPOSITION, "attachment; filename=\"" + filename + "\"")
                .contentType(MediaType.APPLICATION_OCTET_STREAM)
                .body(wordContent);
    }
}
