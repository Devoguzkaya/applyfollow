package com.applyfollow.backend.model;

import jakarta.persistence.*;
import lombok.Data;
import lombok.EqualsAndHashCode;
import java.time.LocalDate;

@Entity
@Table(name = "certificates")
@Data
@EqualsAndHashCode(callSuper = true)
public class Certificate extends BaseEntity {

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id", nullable = false)
    @lombok.ToString.Exclude
    @lombok.EqualsAndHashCode.Exclude
    private User user;

    @Column(nullable = false)
    private String name;

    @Column(nullable = false)
    private String issuer;

    private LocalDate date;

    private String url;
}
