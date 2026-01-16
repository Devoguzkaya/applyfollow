package com.applyfollow.backend.service;

import com.applyfollow.backend.dto.ApplicationRequest;
import com.applyfollow.backend.dto.ApplicationResponse;
import com.applyfollow.backend.dto.CompanyResponse;
import com.applyfollow.backend.dto.ContactDto;
import com.applyfollow.backend.model.Application;
import com.applyfollow.backend.model.Company;
import com.applyfollow.backend.model.Contact;
import com.applyfollow.backend.repository.ApplicationRepository;
import com.applyfollow.backend.repository.ContactRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.UUID;
import java.util.stream.Collectors;

@Service
public class ApplicationService {

    private final ApplicationRepository applicationRepository;
    private final ContactRepository contactRepository;
    private final CompanyService companyService;
    private final com.applyfollow.backend.repository.UserRepository userRepository;

    public ApplicationService(ApplicationRepository applicationRepository,
            ContactRepository contactRepository,
            CompanyService companyService,
            com.applyfollow.backend.repository.UserRepository userRepository) {
        this.applicationRepository = applicationRepository;
        this.contactRepository = contactRepository;
        this.companyService = companyService;
        this.userRepository = userRepository;
    }

    public List<ApplicationResponse> getAllApplications(UUID userId) {
        return applicationRepository.findByUserId(userId).stream()
                .map(this::mapToResponse)
                .collect(Collectors.toList());
    }

    public ApplicationResponse getApplicationById(UUID id) {
        return applicationRepository.findById(id)
                .map(this::mapToResponse)
                .orElseThrow(() -> new com.applyfollow.backend.exception.ResourceNotFoundException(
                        "Application not found with id: " + id));
    }

    @Transactional
    public ApplicationResponse createApplication(ApplicationRequest request, UUID userId) {
        Company company = companyService.findOrCreateCompany(request.companyName());
        com.applyfollow.backend.model.User user = userRepository.findById(userId)
                .orElseThrow(() -> new com.applyfollow.backend.exception.ResourceNotFoundException("User not found"));

        Application application = new Application();
        application.setUser(user);
        application.setCompany(company);
        application.setPosition(request.position());
        application.setStatus(request.status());
        application.setJobUrl(request.jobUrl());
        application.setNotes(request.notes());
        if (request.appliedAt() != null) {
            application.setAppliedAt(request.appliedAt());
        }

        Application savedApplication = applicationRepository.save(application);
        return mapToResponse(savedApplication);
    }

    // --- Contacts Methods ---

    @Transactional
    public ContactDto addContact(UUID applicationId, ContactDto contactDto) {
        Application application = applicationRepository.findById(applicationId)
                .orElseThrow(
                        () -> new com.applyfollow.backend.exception.ResourceNotFoundException("Application not found"));

        Contact contact = new Contact();
        contact.setName(contactDto.name());
        contact.setRole(contactDto.role());
        contact.setEmail(contactDto.email());
        contact.setPhone(contactDto.phone());
        contact.setLinkedIn(contactDto.linkedIn());
        contact.setApplication(application);

        Contact savedContact = contactRepository.save(contact);
        return mapToContactDto(savedContact);
    }

    public List<ContactDto> getContacts(UUID applicationId) {
        return contactRepository.findByApplicationId(applicationId).stream()
                .map(this::mapToContactDto)
                .collect(Collectors.toList());
    }

    @Transactional
    public ApplicationResponse updateNotes(UUID id, String notes) {
        Application application = applicationRepository.findById(id)
                .orElseThrow(() -> new com.applyfollow.backend.exception.ResourceNotFoundException(
                        "Application not found with id: " + id));

        application.setNotes(notes);
        Application savedApplication = applicationRepository.save(application);
        return mapToResponse(savedApplication);
    }

    @Transactional
    public ApplicationResponse updateStatus(UUID id, String status) {
        Application application = applicationRepository.findById(id)
                .orElseThrow(() -> new com.applyfollow.backend.exception.ResourceNotFoundException(
                        "Application not found with id: " + id));

        application.setStatus(com.applyfollow.backend.model.ApplicationStatus.valueOf(status));
        Application savedApplication = applicationRepository.save(application);
        return mapToResponse(savedApplication);
    }

    private ContactDto mapToContactDto(Contact contact) {
        return new ContactDto(
                contact.getId(),
                contact.getName(),
                contact.getRole(),
                contact.getEmail(),
                contact.getPhone(),
                contact.getLinkedIn());
    }

    private ApplicationResponse mapToResponse(Application application) {
        Company company = application.getCompany();
        CompanyResponse companyResponse = new CompanyResponse(
                company.getId(),
                company.getName(),
                company.getWebsite(),
                company.getLinkedinUrl(),
                company.getLogoUrl(),
                company.getCreatedAt());

        return new ApplicationResponse(
                application.getId(),
                companyResponse,
                application.getPosition(),
                application.getStatus(),
                application.getJobUrl(),
                application.getNotes(),
                application.getAppliedAt());
    }
}

