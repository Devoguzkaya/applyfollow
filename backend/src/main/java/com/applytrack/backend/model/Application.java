package com.applytrack.backend.model;

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
    @JoinColumn(name = "user_id") // Şimdilik nullable olabilir test için, auth gelince false yaparız
    private User user;

    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "company_id", nullable = false)
    private Company company;

    private String position;
    @Enumerated(EnumType.STRING)
    private ApplicationStatus status;
    private String jobUrl;
    private String notes;
    private LocalDateTime appliedAt = LocalDateTime.now();

}
