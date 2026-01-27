package com.applyfollow.backend.repository;

import com.applyfollow.backend.model.Experience;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.transaction.annotation.Transactional;
import java.util.UUID;

public interface ExperienceRepository extends JpaRepository<Experience, UUID> {
    @Modifying
    @Transactional
    @Query("DELETE FROM Experience e WHERE e.user.id = :userId")
    void deleteByUserId(UUID userId);
}
