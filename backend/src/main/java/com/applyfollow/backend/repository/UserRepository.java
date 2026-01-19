package com.applyfollow.backend.repository;

import com.applyfollow.backend.model.User;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.Optional;
import java.util.UUID;

public interface UserRepository extends JpaRepository<User, UUID> {
        Optional<User> findByEmail(String email);

        @org.springframework.data.jpa.repository.Query("SELECT u FROM User u " +
                        "LEFT JOIN FETCH u.educations " +
                        "LEFT JOIN FETCH u.experiences " +
                        "LEFT JOIN FETCH u.skills " +
                        "LEFT JOIN FETCH u.languages " +
                        "LEFT JOIN FETCH u.certificates " +
                        "WHERE u.id = :id")
        Optional<User> findByIdWithDetails(@org.springframework.data.repository.query.Param("id") java.util.UUID id);

        // For slug based lookup
        Optional<User> findFirstByEmailStartingWith(String prefix);

        org.springframework.data.domain.Page<User> findByEmailContainingIgnoreCase(String email,
                        org.springframework.data.domain.Pageable pageable);
}
