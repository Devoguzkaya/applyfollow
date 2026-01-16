package com.applyfollow.backend.repository;

import com.applyfollow.backend.model.Skill;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.UUID;

public interface SkillRepository extends JpaRepository<Skill, UUID> {
    void deleteByUserId(UUID userId);
}

