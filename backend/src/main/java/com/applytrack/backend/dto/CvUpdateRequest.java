package com.applytrack.backend.dto;

import jakarta.validation.constraints.NotNull;

import java.time.LocalDate;
import java.util.List;
import java.util.UUID;

public record CvUpdateRequest(
                String summary,
                String phoneNumber,
                String address,
                String linkedinUrl,
                String githubUrl,
                String websiteUrl,
                List<EducationDto> educations,
                List<ExperienceDto> experiences,
                List<SkillDto> skills,
                List<LanguageDto> languages,
                List<CertificateDto> certificates) {

        public record EducationDto(
                        UUID id,
                        @NotNull String schoolName,
                        @NotNull String fieldOfStudy,
                        String degree,
                        LocalDate startDate,
                        LocalDate endDate,
                        boolean isCurrent) {
        }

        public record ExperienceDto(
                        UUID id,
                        @NotNull String companyName,
                        @NotNull String position,
                        String description,
                        LocalDate startDate,
                        LocalDate endDate,
                        boolean isCurrent) {
        }

        public record SkillDto(
                        UUID id,
                        @NotNull String name,
                        String level) {
        }

        public record LanguageDto(
                        UUID id,
                        @NotNull String name,
                        @NotNull String level) {
        }

        public record CertificateDto(
                        UUID id,
                        @NotNull String name,
                        String issuer,
                        LocalDate date,
                        String url) {
        }
}
