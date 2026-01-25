package com.applyfollow.backend.controller;

import com.applyfollow.backend.dto.ApplicationRequest;
import com.applyfollow.backend.dto.ApplicationResponse;
import com.applyfollow.backend.dto.ContactDto;
import com.applyfollow.backend.model.User;
import com.applyfollow.backend.service.ApplicationService;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/api/applications")
public class ApplicationController {

    private final ApplicationService service;

    public ApplicationController(ApplicationService service) {
        this.service = service;
    }

    @GetMapping
    public List<ApplicationResponse> findAll(@AuthenticationPrincipal UserDetails userDetails) {
        User user = (User) userDetails;
        return service.getAllApplications(user.getId());
    }

    // Admin endpoint to view other users' applications
    @GetMapping("/user/{userId}")
    public List<ApplicationResponse> findAllByUserId(@PathVariable UUID userId) {
        return service.getAllApplications(userId);
    }

    @GetMapping("/{id}")
    public ApplicationResponse findById(@PathVariable UUID id, @AuthenticationPrincipal UserDetails userDetails) {
        User user = (User) userDetails;
        return service.getApplicationById(id, user.getId());
    }

    @PostMapping
    @ResponseStatus(HttpStatus.CREATED)
    public ApplicationResponse save(@Valid @RequestBody ApplicationRequest request,
            @AuthenticationPrincipal UserDetails userDetails) {
        User user = (User) userDetails;
        return service.createApplication(request, user.getId());
    }

    // --- Contacts Endpoints ---

    @PostMapping("/{id}/contacts")
    @ResponseStatus(HttpStatus.CREATED)
    public ContactDto addContact(@PathVariable UUID id, @RequestBody ContactDto contactDto,
            @AuthenticationPrincipal UserDetails userDetails) {
        User user = (User) userDetails;
        return service.addContact(id, contactDto, user.getId());
    }

    @GetMapping("/{id}/contacts")
    public List<ContactDto> getContacts(@PathVariable UUID id, @AuthenticationPrincipal UserDetails userDetails) {
        User user = (User) userDetails;
        return service.getContacts(id, user.getId());
    }

    @PatchMapping("/{id}/notes")
    public ApplicationResponse updateNotes(@PathVariable UUID id, @RequestBody String notes,
            @AuthenticationPrincipal UserDetails userDetails) {
        User user = (User) userDetails;
        return service.updateNotes(id, notes, user.getId());
    }

    @PatchMapping("/{id}/status")
    public ApplicationResponse updateStatus(@PathVariable UUID id, @RequestParam String status,
            @AuthenticationPrincipal UserDetails userDetails) {
        User user = (User) userDetails;
        return service.updateStatus(id, status, user.getId());
    }

    @DeleteMapping("/{id}")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    public void delete(@PathVariable UUID id, @AuthenticationPrincipal UserDetails userDetails) {
        User user = (User) userDetails;
        service.deleteApplication(id, user.getId());
    }
}
