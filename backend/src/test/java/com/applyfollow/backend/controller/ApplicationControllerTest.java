package com.applyfollow.backend.controller;

import com.applyfollow.backend.dto.ApplicationRequest;
import com.applyfollow.backend.dto.ApplicationResponse;
import com.applyfollow.backend.dto.CompanyResponse;
import com.applyfollow.backend.model.ApplicationStatus;
import com.applyfollow.backend.model.Role;
import com.applyfollow.backend.model.User;
import com.applyfollow.backend.service.ApplicationService;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.boot.test.mock.mockito.MockBean;
import org.springframework.http.MediaType;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.test.web.servlet.MockMvc;

import java.time.LocalDateTime;
import java.util.Arrays;
import java.util.List;
import java.util.UUID;

import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.when;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

@SpringBootTest
@AutoConfigureMockMvc
public class ApplicationControllerTest {

        @Autowired
        private MockMvc mockMvc;

        @Autowired
        private ObjectMapper objectMapper;

        @MockBean
        private ApplicationService applicationService;

        private User mockUser;

        @BeforeEach
        void setUp() {
                mockUser = User.builder()
                                .id(UUID.randomUUID())
                                .email("test@example.com")
                                .fullName("Test User")
                                .role(Role.USER)
                                .build();

                UsernamePasswordAuthenticationToken authentication = new UsernamePasswordAuthenticationToken(
                                mockUser, null, mockUser.getAuthorities());
                SecurityContextHolder.getContext().setAuthentication(authentication);
        }

        @Test
        public void getAllApplications_ShouldReturnList() throws Exception {
                UUID randomId = UUID.randomUUID();
                CompanyResponse company = new CompanyResponse(UUID.randomUUID(), "Company A", "website.com",
                                "linkedin.com",
                                "logo.png", LocalDateTime.now());
                ApplicationResponse appResp = new ApplicationResponse(randomId, company, "Dev",
                                ApplicationStatus.APPLIED,
                                "url", "notes", LocalDateTime.now());

                List<ApplicationResponse> apps = Arrays.asList(appResp);

                when(applicationService.getAllApplications(any(UUID.class))).thenReturn(apps);

                mockMvc.perform(get("/api/applications")
                                .header("X-User-Id", mockUser.getId().toString())) // Header kontrolü controllerda var
                                .andExpect(status().isOk())
                                .andExpect(jsonPath("$[0].company.name").value("Company A"));
        }

        @Test
        public void createApplication_ShouldReturnCreatedApp() throws Exception {
                ApplicationRequest request = new ApplicationRequest("Company B", "Developer", ApplicationStatus.APPLIED,
                                "http://job.url", "notes", null);

                CompanyResponse company = new CompanyResponse(UUID.randomUUID(), "Company B", null, null, null,
                                LocalDateTime.now());
                ApplicationResponse response = new ApplicationResponse(UUID.randomUUID(), company, "Developer",
                                ApplicationStatus.APPLIED, "http://job.url", "notes", LocalDateTime.now());

                when(applicationService.createApplication(any(ApplicationRequest.class), any(UUID.class)))
                                .thenReturn(response);

                mockMvc.perform(post("/api/applications")
                                .header("X-User-Id", mockUser.getId().toString())
                                .contentType(MediaType.APPLICATION_JSON)
                                .content(objectMapper.writeValueAsString(request)))
                                .andExpect(status().isCreated())
                                .andExpect(jsonPath("$.company.name").value("Company B"));
        }
}

