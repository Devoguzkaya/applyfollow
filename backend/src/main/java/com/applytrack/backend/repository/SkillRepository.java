package com.applytrack.backend.repository;

import com.applytrack.backend.model.Skill;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.UUID;

public interface SkillRepository extends JpaRepository<Skill, UUID> {
    void deleteByUserId(UUID userId);
}
