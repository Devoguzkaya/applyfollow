package com.applyfollow.backend.repository;

import com.applyfollow.backend.model.Experience;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.UUID;

public interface ExperienceRepository extends JpaRepository<Experience, UUID> {
    void deleteByUserId(UUID userId);
}

