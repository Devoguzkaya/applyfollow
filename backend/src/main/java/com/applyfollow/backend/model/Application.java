package com.applyfollow.backend.model;

import jakarta.persistence.*;
import lombok.Data;
import lombok.EqualsAndHashCode;
import java.time.LocalDateTime;

@Entity
@Table(name = "applications")
@Data
@EqualsAndHashCode(callSuper = true)
public class Application extends BaseEntity {

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id", nullable = false)
    @lombok.ToString.Exclude
    @lombok.EqualsAndHashCode.Exclude
    private User user;

    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "company_id", nullable = false)
    private Company company;

    private String position;
    @Enumerated(EnumType.STRING)
    private ApplicationStatus status;
    private String jobUrl;

    @Column(columnDefinition = "TEXT")
    private String notes;

    private LocalDateTime appliedAt = LocalDateTime.now();

}
