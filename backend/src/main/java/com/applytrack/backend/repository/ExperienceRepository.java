package com.applytrack.backend.repository;

import com.applytrack.backend.model.Experience;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.UUID;

public interface ExperienceRepository extends JpaRepository<Experience, UUID> {
    void deleteByUserId(UUID userId);
}
