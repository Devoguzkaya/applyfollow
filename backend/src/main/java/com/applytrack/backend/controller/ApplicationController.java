package com.applytrack.backend.controller;

import com.applytrack.backend.dto.ApplicationRequest;
import com.applytrack.backend.dto.ApplicationResponse;
import com.applytrack.backend.dto.ContactDto;
import com.applytrack.backend.model.User;
import com.applytrack.backend.service.ApplicationService;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/api/applications")
@CrossOrigin(origins = "http://localhost:3000")
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

    @GetMapping("/{id}")
    public ApplicationResponse findById(@PathVariable UUID id) {
        return service.getApplicationById(id);
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
    public ContactDto addContact(@PathVariable UUID id, @RequestBody ContactDto contactDto) {
        return service.addContact(id, contactDto);
    }

    @GetMapping("/{id}/contacts")
    public List<ContactDto> getContacts(@PathVariable UUID id) {
        return service.getContacts(id);
    }
}
