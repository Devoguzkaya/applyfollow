package com.applytrack.backend.model;

import com.applytrack.backend.model.enums.LanguageLevel;
import jakarta.persistence.*;
import lombok.Data;
import lombok.EqualsAndHashCode;

@Entity
@Table(name = "languages")
@Data
@EqualsAndHashCode(callSuper = true)
public class Language extends BaseEntity {

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id", nullable = false)
    private User user;

    @Column(nullable = false)
    private String name;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private LanguageLevel level;
}
