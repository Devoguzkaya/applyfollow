package com.applyfollow.backend.repository;

import com.applyfollow.backend.model.Application;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.UUID;
import java.util.List;
import java.util.Optional;

public interface ApplicationRepository extends JpaRepository<Application, UUID> {
    @org.springframework.data.jpa.repository.Query("SELECT a FROM Application a JOIN FETCH a.company WHERE a.user.id = :userId")
    List<Application> findAllByUserId(UUID userId);

    // Duplicate kontrolü için
    Optional<Application> findByUserIdAndCompany_NameAndPosition(UUID userId, String companyName, String position);

    boolean existsByIdAndUser_Id(UUID id, UUID userId);
}
