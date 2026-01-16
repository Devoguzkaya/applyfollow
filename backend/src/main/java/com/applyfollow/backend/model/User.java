package com.applyfollow.backend.model;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.EqualsAndHashCode;
import lombok.NoArgsConstructor;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.userdetails.UserDetails;

import java.util.Collection;
import java.util.List;
import java.util.Set;
import java.util.UUID;

@Entity
@Table(name = "users")
@Data
@NoArgsConstructor
@EqualsAndHashCode(callSuper = true)
public class User extends BaseEntity implements UserDetails {

    @Builder
    public User(UUID id, String email, String passwordHash, String fullName, Role role, boolean active,
            String summary, String phoneNumber, String address, String linkedinUrl, String githubUrl, String websiteUrl,
            String cvTitle,
            List<Application> applications, Set<Education> educations,
            Set<Experience> experiences, Set<Skill> skills, Set<Language> languages, Set<Certificate> certificates) {
        this.setId(id);
        this.email = email;
        this.passwordHash = passwordHash;
        this.fullName = fullName;
        this.role = role;
        this.active = active;
        this.summary = summary;
        this.phoneNumber = phoneNumber;
        this.address = address;
        this.linkedinUrl = linkedinUrl;
        this.githubUrl = githubUrl;
        this.websiteUrl = websiteUrl;
        this.cvTitle = cvTitle;
        this.applications = applications;
        this.educations = educations;
        this.experiences = experiences;
        this.skills = skills;
        this.languages = languages;
        this.certificates = certificates;
    }

    @Column(unique = true, nullable = false)
    private String email;

    private String passwordHash;
    private String fullName;

    @Column(columnDefinition = "TEXT")
    private String summary;

    private String phoneNumber;
    private String address;
    private String linkedinUrl;
    private String githubUrl;
    private String websiteUrl;
    private String cvTitle;

    @Enumerated(EnumType.STRING)
    private Role role;

    @Column(nullable = false)
    private boolean active = true;

    @OneToMany(mappedBy = "user", cascade = CascadeType.ALL, orphanRemoval = true)
    @lombok.ToString.Exclude
    @lombok.EqualsAndHashCode.Exclude
    private List<Application> applications;

    @OneToMany(mappedBy = "user", cascade = CascadeType.ALL, orphanRemoval = true)
    @OrderBy("startDate DESC")
    @lombok.ToString.Exclude
    @lombok.EqualsAndHashCode.Exclude
    private Set<Education> educations;

    @OneToMany(mappedBy = "user", cascade = CascadeType.ALL, orphanRemoval = true)
    @OrderBy("startDate DESC")
    @lombok.ToString.Exclude
    @lombok.EqualsAndHashCode.Exclude
    private Set<Experience> experiences;

    @OneToMany(mappedBy = "user", cascade = CascadeType.ALL, orphanRemoval = true)
    @lombok.ToString.Exclude
    @lombok.EqualsAndHashCode.Exclude
    private Set<Skill> skills;

    @OneToMany(mappedBy = "user", cascade = CascadeType.ALL, orphanRemoval = true)
    @lombok.ToString.Exclude
    @lombok.EqualsAndHashCode.Exclude
    private Set<Language> languages;

    @OneToMany(mappedBy = "user", cascade = CascadeType.ALL, orphanRemoval = true)
    @OrderBy("date DESC")
    @lombok.ToString.Exclude
    @lombok.EqualsAndHashCode.Exclude
    private Set<Certificate> certificates;

    @Override
    public Collection<? extends GrantedAuthority> getAuthorities() {
        return List.of(new SimpleGrantedAuthority(role.name()));
    }

    @Override
    public String getPassword() {
        return passwordHash;
    }

    @Override
    public String getUsername() {
        return email;
    }

    @Override
    public boolean isAccountNonExpired() {
        return true;
    }

    @Override
    public boolean isAccountNonLocked() {
        return true;
    }

    @Override
    public boolean isCredentialsNonExpired() {
        return true;
    }

    @Override
    public boolean isEnabled() {
        return active;
    }
}
