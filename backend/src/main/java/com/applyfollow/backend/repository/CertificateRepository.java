package com.applyfollow.backend.repository;

import com.applyfollow.backend.model.Certificate;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.UUID;

@Repository
public interface CertificateRepository extends JpaRepository<Certificate, UUID> {
    void deleteByUserId(UUID userId);
}

