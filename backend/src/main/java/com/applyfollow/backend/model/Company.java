package com.applyfollow.backend.model;

import jakarta.persistence.*;
import lombok.Data;
import lombok.EqualsAndHashCode;

@Entity
@Table(name = "companies")
@Data
@EqualsAndHashCode(callSuper = true)
public class Company extends BaseEntity {

    @Column(unique = true, nullable = false)
    private String name;

    private String website;
    private String linkedinUrl;
    private String logoUrl;
}

