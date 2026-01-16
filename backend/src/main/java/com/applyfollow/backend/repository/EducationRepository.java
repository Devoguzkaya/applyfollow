package com.applyfollow.backend.repository;

import com.applyfollow.backend.model.Education;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.UUID;

public interface EducationRepository extends JpaRepository<Education, UUID> {
    void deleteByUserId(UUID userId);
}

