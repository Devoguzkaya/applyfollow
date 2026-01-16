package com.applyfollow.backend.service;

import com.applyfollow.backend.dto.CvUpdateRequest;
import com.applyfollow.backend.model.User;
import com.applyfollow.backend.repository.CertificateRepository;
import com.applyfollow.backend.repository.EducationRepository;
import com.applyfollow.backend.repository.ExperienceRepository;
import com.applyfollow.backend.repository.LanguageRepository;
import com.applyfollow.backend.repository.SkillRepository;
import com.applyfollow.backend.repository.UserRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.util.Collections;
import java.util.List;
import java.util.Optional;
import java.util.UUID;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.anyList;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class CvServiceTest {

    @Mock
    private EducationRepository educationRepository;
    @Mock
    private ExperienceRepository experienceRepository;
    @Mock
    private SkillRepository skillRepository;
    @Mock
    private UserRepository userRepository;
    @Mock
    private LanguageRepository languageRepository;
    @Mock
    private CertificateRepository certificateRepository;

    @InjectMocks
    private CvService cvService;

    private User user;

    @BeforeEach
    void setUp() {
        user = User.builder().id(UUID.randomUUID()).email("cv@test.com").build();
    }

    @Test
    void getCv_ShouldReturnCombinedDto() {
        when(userRepository.findByIdWithDetails(user.getId())).thenReturn(Optional.of(user));

        CvUpdateRequest result = cvService.getCv(user.getId());

        assertNotNull(result);
        assertTrue(result.educations().isEmpty());
    }

    @Test
    void updateCv_ShouldDeleteOldAndSaveNew() {
        CvUpdateRequest.EducationDto eduDto = new CvUpdateRequest.EducationDto(null, "School", "Field", "Degree", null,
                null, false);
        CvUpdateRequest request = new CvUpdateRequest(
                null, null, null, null, null, null, null,
                List.of(eduDto), Collections.emptyList(), Collections.emptyList(), Collections.emptyList(),
                Collections.emptyList());

        when(userRepository.findById(user.getId())).thenReturn(Optional.of(user));

        cvService.updateCv(user.getId(), request);

        // Verify clean up
        verify(educationRepository).deleteByUserId(user.getId());
        verify(experienceRepository).deleteByUserId(user.getId());
        verify(skillRepository).deleteByUserId(user.getId());
        verify(languageRepository).deleteByUserId(user.getId());
        verify(certificateRepository).deleteByUserId(user.getId());

        // Verify save
        verify(educationRepository).saveAll(anyList());
    }
}
