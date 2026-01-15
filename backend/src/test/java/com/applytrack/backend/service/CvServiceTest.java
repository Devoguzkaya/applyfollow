package com.applytrack.backend.service;

import com.applytrack.backend.dto.CvUpdateRequest;
import com.applytrack.backend.model.User;
import com.applytrack.backend.repository.EducationRepository;
import com.applytrack.backend.repository.ExperienceRepository;
import com.applytrack.backend.repository.SkillRepository;
import com.applytrack.backend.repository.UserRepository;
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
                null, null, null, null, null, null,
                List.of(eduDto), Collections.emptyList(), Collections.emptyList(), Collections.emptyList(),
                Collections.emptyList());

        when(userRepository.findById(user.getId())).thenReturn(Optional.of(user));

        cvService.updateCv(user.getId(), request);

        // Verify clean up
        verify(educationRepository).deleteByUserId(user.getId());
        verify(experienceRepository).deleteByUserId(user.getId());
        verify(skillRepository).deleteByUserId(user.getId());

        // Verify save
        verify(educationRepository).saveAll(anyList());
    }
}
