package com.applyfollow.backend.controller;

import com.applyfollow.backend.dto.CvUpdateRequest;
import com.applyfollow.backend.model.Role;
import com.applyfollow.backend.model.User;
import com.applyfollow.backend.service.CvService;
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

import java.util.Collections;
import java.util.UUID;

import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.doNothing;
import static org.mockito.Mockito.when;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

@SpringBootTest
@AutoConfigureMockMvc
public class CvControllerTest {

        @Autowired
        private MockMvc mockMvc;

        @Autowired
        private ObjectMapper objectMapper;

        @MockBean
        private CvService cvService;

        private User mockUser;

        @BeforeEach
        void setUp() {
                // Setup Application User in Security Context to avoid ClassCastException
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
        public void getCv_ShouldReturnCvData() throws Exception {
                CvUpdateRequest cvData = new CvUpdateRequest(
                                null, null, null, null, null, null, null, // summary to title
                                null, null, null, // colors and profileImage
                                Collections.emptyList(), Collections.emptyList(),
                                Collections.emptyList(), Collections.emptyList(),
                                Collections.emptyList());
                when(cvService.getCv(any(UUID.class))).thenReturn(cvData);

                mockMvc.perform(get("/api/cv"))
                                .andExpect(status().isOk())
                                .andExpect(jsonPath("$.educations").isArray());
        }

        @Test
        public void updateCv_ShouldReturnOk() throws Exception {
                CvUpdateRequest request = new CvUpdateRequest(
                                null, null, null, null, null, null, null, // summary to title
                                null, null, null, // colors and profileImage
                                Collections.emptyList(), Collections.emptyList(),
                                Collections.emptyList(), Collections.emptyList(),
                                Collections.emptyList());
                doNothing().when(cvService).updateCv(any(UUID.class), any(CvUpdateRequest.class));

                mockMvc.perform(post("/api/cv")
                                .contentType(MediaType.APPLICATION_JSON)
                                .content(objectMapper.writeValueAsString(request)))
                                .andExpect(status().isOk());
        }

        @Test
        public void downloadCv_ShouldReturnWordDocument() throws Exception {
                byte[] dummyContent = "dummy word content".getBytes();
                when(cvService.generateWordCv(any(UUID.class))).thenReturn(dummyContent);

                mockMvc.perform(get("/api/cv/download"))
                                .andExpect(status().isOk())
                                .andExpect(header().exists("Content-Disposition"))
                                .andExpect(content().contentType(MediaType.APPLICATION_OCTET_STREAM));
        }
}
