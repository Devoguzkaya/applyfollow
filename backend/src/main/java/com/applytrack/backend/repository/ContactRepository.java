package com.applytrack.backend.repository;

import com.applytrack.backend.model.Contact;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;
import java.util.UUID;

public interface ContactRepository extends JpaRepository<Contact, UUID> {
    List<Contact> findByApplicationId(UUID applicationId);
}
