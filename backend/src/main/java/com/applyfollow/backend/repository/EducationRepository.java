package com.applyfollow.backend.repository;

import com.applyfollow.backend.model.Education;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.transaction.annotation.Transactional;
import java.util.UUID;

public interface EducationRepository extends JpaRepository<Education, UUID> {
    @Modifying
    @Transactional
    @Query("DELETE FROM Education e WHERE e.user.id = :userId")
    void deleteByUserId(UUID userId);
}
