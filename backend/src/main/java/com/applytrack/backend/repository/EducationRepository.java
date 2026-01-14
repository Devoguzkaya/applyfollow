package com.applytrack.backend.repository;

import com.applytrack.backend.model.Education;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.UUID;

public interface EducationRepository extends JpaRepository<Education, UUID> {
    void deleteByUserId(UUID userId);
}
