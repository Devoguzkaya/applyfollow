package com.applyfollow.backend.service;

import com.applyfollow.backend.dto.ApplicationRequest;
import com.applyfollow.backend.dto.ApplicationResponse;
import com.applyfollow.backend.dto.ContactDto;
import com.applyfollow.backend.exception.ResourceNotFoundException;
import com.applyfollow.backend.model.*;
import com.applyfollow.backend.repository.ApplicationRepository;
import com.applyfollow.backend.repository.ContactRepository;
import com.applyfollow.backend.repository.UserRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.time.LocalDateTime;
import java.util.Collections;
import java.util.List;
import java.util.Optional;
import java.util.UUID;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.anyString;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class ApplicationServiceTest {

    @Mock
    private ApplicationRepository applicationRepository;
    @Mock
    private ContactRepository contactRepository;
    @Mock
    private CompanyService companyService;
    @Mock
    private UserRepository userRepository;

    @InjectMocks
    private ApplicationService applicationService;

    private User user;
    private Company company;
    private Application application;

    @BeforeEach
    void setUp() {
        user = User.builder().id(UUID.randomUUID()).email("test@test.com").build();
        company = new Company();
        company.setId(UUID.randomUUID());
        company.setName("Test Company");

        application = new Application();
        application.setId(UUID.randomUUID());
        application.setUser(user);
        application.setCompany(company);
        application.setStatus(ApplicationStatus.APPLIED);
        application.setCreatedAt(LocalDateTime.now());
    }

    @Test
    void getAllApplications_ShouldReturnList() {
        when(applicationRepository.findByUserId(user.getId())).thenReturn(List.of(application));

        List<ApplicationResponse> result = applicationService.getAllApplications(user.getId());

        assertNotNull(result);
        assertEquals(1, result.size());
        assertEquals(application.getId(), result.get(0).id());
    }

    @Test
    void getApplicationById_WhenExists_ShouldReturnApplication() {
        when(applicationRepository.findById(application.getId())).thenReturn(Optional.of(application));

        ApplicationResponse result = applicationService.getApplicationById(application.getId());

        assertNotNull(result);
        assertEquals(application.getId(), result.id());
    }

    @Test
    void getApplicationById_WhenNotExists_ShouldThrowException() {
        UUID randomId = UUID.randomUUID();
        when(applicationRepository.findById(randomId)).thenReturn(Optional.empty());

        assertThrows(ResourceNotFoundException.class, () -> applicationService.getApplicationById(randomId));
    }

    @Test
    void createApplication_ShouldCreateAndReturn() {
        ApplicationRequest request = new ApplicationRequest("Test Company", "Dev", ApplicationStatus.APPLIED,
                "http://url", "Notes", null);

        when(companyService.findOrCreateCompany(anyString())).thenReturn(company);
        when(userRepository.findById(user.getId())).thenReturn(Optional.of(user));
        when(applicationRepository.save(any(Application.class))).thenReturn(application);

        ApplicationResponse result = applicationService.createApplication(request, user.getId());

        assertNotNull(result);
        assertEquals("Test Company", result.company().name());
        verify(applicationRepository).save(any(Application.class));
    }

    @Test
    void addContact_ShouldAddContactToApplication() {
        ContactDto contactDto = new ContactDto(null, "John Doe", "Recruiter", "john@test.com", "123", "linked.in/john");
        Contact contact = new Contact();
        contact.setId(UUID.randomUUID());
        contact.setName("John Doe");

        when(applicationRepository.findById(application.getId())).thenReturn(Optional.of(application));
        when(contactRepository.save(any(Contact.class))).thenReturn(contact);

        ContactDto result = applicationService.addContact(application.getId(), contactDto);

        assertNotNull(result);
        assertEquals("John Doe", result.name());
        verify(contactRepository).save(any(Contact.class));
    }
}

