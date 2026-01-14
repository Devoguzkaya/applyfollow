package com.applytrack.backend.service;

import com.applytrack.backend.dto.CvUpdateRequest;
import com.applytrack.backend.exception.ResourceNotFoundException;
import com.applytrack.backend.model.*;
import com.applytrack.backend.model.enums.LanguageLevel;
import com.applytrack.backend.repository.*;
import lombok.RequiredArgsConstructor;
import org.apache.poi.xwpf.usermodel.*;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.io.ByteArrayOutputStream;
import java.io.IOException;
import java.time.format.DateTimeFormatter;
import java.util.Collections;
import java.util.List;
import java.util.UUID;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class CvService {

        private final EducationRepository educationRepository;
        private final ExperienceRepository experienceRepository;
        private final SkillRepository skillRepository;
        private final LanguageRepository languageRepository;
        private final CertificateRepository certificateRepository;
        private final UserRepository userRepository;

        @Transactional
        public void updateCv(UUID userId, CvUpdateRequest request) {
                User user = userRepository.findById(userId)
                                .orElseThrow(() -> new ResourceNotFoundException("User not found"));

                // Kişisel Bilgileri Güncelle
                user.setSummary(request.summary());
                user.setPhoneNumber(request.phoneNumber());
                user.setAddress(request.address());
                user.setLinkedinUrl(request.linkedinUrl());
                user.setGithubUrl(request.githubUrl());
                user.setWebsiteUrl(request.websiteUrl());
                userRepository.save(user);

                // Eğitimleri Güncelle
                educationRepository.deleteByUserId(userId);
                educationRepository.flush();

                if (request.educations() != null) {
                        List<Education> newEducations = request.educations().stream()
                                        .map(dto -> Education.builder()
                                                        .user(user)
                                                        .schoolName(dto.schoolName())
                                                        .fieldOfStudy(dto.fieldOfStudy())
                                                        .degree(dto.degree())
                                                        .startDate(dto.startDate())
                                                        .endDate(dto.endDate())
                                                        .isCurrent(dto.isCurrent())
                                                        .build())
                                        .collect(Collectors.toList());
                        educationRepository.saveAll(newEducations);
                }

                // Deneyimleri Güncelle
                experienceRepository.deleteByUserId(userId);
                experienceRepository.flush();

                if (request.experiences() != null) {
                        List<Experience> newExperiences = request.experiences().stream()
                                        .map(dto -> Experience.builder()
                                                        .user(user)
                                                        .companyName(dto.companyName())
                                                        .position(dto.position())
                                                        .description(dto.description())
                                                        .startDate(dto.startDate())
                                                        .endDate(dto.endDate())
                                                        .isCurrent(dto.isCurrent())
                                                        .build())
                                        .collect(Collectors.toList());
                        experienceRepository.saveAll(newExperiences);
                }

                // Yetenekleri Güncelle
                skillRepository.deleteByUserId(userId);
                skillRepository.flush();

                if (request.skills() != null) {
                        List<Skill> newSkills = request.skills().stream()
                                        .map(dto -> Skill.builder()
                                                        .user(user)
                                                        .name(dto.name())
                                                        .level(dto.level())
                                                        .build())
                                        .collect(Collectors.toList());
                        skillRepository.saveAll(newSkills);
                }

                // Dilleri Güncelle
                languageRepository.deleteByUserId(userId);
                languageRepository.flush();

                if (request.languages() != null) {
                        List<Language> newLanguages = request.languages().stream()
                                        .map(dto -> {
                                                Language lang = new Language();
                                                lang.setUser(user);
                                                lang.setName(dto.name());
                                                try {
                                                        lang.setLevel(LanguageLevel.valueOf(dto.level().toUpperCase()));
                                                } catch (IllegalArgumentException | NullPointerException e) {
                                                        lang.setLevel(LanguageLevel.BASIC); // Varsayılan
                                                }
                                                return lang;
                                        })
                                        .collect(Collectors.toList());
                        languageRepository.saveAll(newLanguages);
                }

                // Sertifikaları Güncelle
                certificateRepository.deleteByUserId(userId);
                certificateRepository.flush();

                if (request.certificates() != null) {
                        List<Certificate> newCertificates = request.certificates().stream()
                                        .map(dto -> {
                                                Certificate cert = new Certificate();
                                                cert.setUser(user);
                                                cert.setName(dto.name());
                                                cert.setIssuer(dto.issuer());
                                                cert.setDate(dto.date());
                                                cert.setUrl(dto.url());
                                                return cert;
                                        })
                                        .collect(Collectors.toList());
                        certificateRepository.saveAll(newCertificates);
                }
        }

        @Transactional(readOnly = true)
        public CvUpdateRequest getCv(UUID userId) {
                User user = userRepository.findByIdWithDetails(userId)
                                .orElseThrow(() -> new ResourceNotFoundException("User not found"));

                List<CvUpdateRequest.EducationDto> educations = user.getEducations() == null ? Collections.emptyList()
                                : user.getEducations().stream()
                                                .map(e -> new CvUpdateRequest.EducationDto(e.getId(), e.getSchoolName(),
                                                                e.getFieldOfStudy(), e.getDegree(), e.getStartDate(),
                                                                e.getEndDate(), e.isCurrent()))
                                                .toList();

                List<CvUpdateRequest.ExperienceDto> experiences = user.getExperiences() == null
                                ? Collections.emptyList()
                                : user.getExperiences().stream()
                                                .map(e -> new CvUpdateRequest.ExperienceDto(e.getId(),
                                                                e.getCompanyName(), e.getPosition(), e.getDescription(),
                                                                e.getStartDate(), e.getEndDate(), e.isCurrent()))
                                                .toList();

                List<CvUpdateRequest.SkillDto> skills = user.getSkills() == null ? Collections.emptyList()
                                : user.getSkills().stream()
                                                .map(s -> new CvUpdateRequest.SkillDto(s.getId(), s.getName(),
                                                                s.getLevel()))
                                                .toList();

                List<CvUpdateRequest.LanguageDto> languages = user.getLanguages() == null ? Collections.emptyList()
                                : user.getLanguages().stream()
                                                .map(l -> new CvUpdateRequest.LanguageDto(l.getId(), l.getName(),
                                                                l.getLevel().name()))
                                                .toList();

                List<CvUpdateRequest.CertificateDto> certificates = user.getCertificates() == null
                                ? Collections.emptyList()
                                : user.getCertificates().stream()
                                                .map(c -> new CvUpdateRequest.CertificateDto(c.getId(), c.getName(),
                                                                c.getIssuer(), c.getDate(), c.getUrl()))
                                                .toList();

                return new CvUpdateRequest(
                                user.getSummary(),
                                user.getPhoneNumber(),
                                user.getAddress(),
                                user.getLinkedinUrl(),
                                user.getGithubUrl(),
                                user.getWebsiteUrl(),
                                educations,
                                experiences,
                                skills,
                                languages,
                                certificates);
        }

        @Transactional(readOnly = true)
        public byte[] generateWordCv(UUID userId) throws IOException {
                User user = userRepository.findByIdWithDetails(userId)
                                .orElseThrow(() -> new ResourceNotFoundException("User not found"));

                try (XWPFDocument document = new XWPFDocument()) {

                        // === BAŞLIK ===
                        XWPFParagraph title = document.createParagraph();
                        title.setAlignment(ParagraphAlignment.CENTER);
                        XWPFRun titleRun = title.createRun();
                        titleRun.setText(user.getFullName() != null ? user.getFullName().toUpperCase() : "");
                        titleRun.setBold(true);
                        titleRun.setFontSize(24);
                        titleRun.setFontFamily("Arial");
                        titleRun.setColor("2E7D32");

                        // === İLETİŞİM BİLGİLERİ ===
                        XWPFParagraph contact = document.createParagraph();
                        contact.setAlignment(ParagraphAlignment.CENTER);
                        XWPFRun contactRun = contact.createRun();

                        StringBuilder contactText = new StringBuilder();
                        contactText.append(user.getEmail());
                        if (user.getPhoneNumber() != null)
                                contactText.append("  |  ").append(user.getPhoneNumber());
                        if (user.getAddress() != null)
                                contactText.append("  |  ").append(user.getAddress());

                        contactRun.setText(contactText.toString());
                        contactRun.setFontSize(10);
                        contactRun.addBreak();

                        // === LİNKLER ===
                        if (user.getLinkedinUrl() != null || user.getGithubUrl() != null) {
                                XWPFParagraph links = document.createParagraph();
                                links.setAlignment(ParagraphAlignment.CENTER);
                                XWPFRun linksRun = links.createRun();
                                String linkText = "";
                                if (user.getLinkedinUrl() != null)
                                        linkText += "LinkedIn: " + user.getLinkedinUrl() + "  ";
                                if (user.getGithubUrl() != null)
                                        linkText += "GitHub: " + user.getGithubUrl();
                                linksRun.setText(linkText);
                                linksRun.setFontSize(9);
                                linksRun.setColor("0000FF");
                                linksRun.addBreak();
                        }

                        // === ÖZET (SUMMARY) ===
                        if (user.getSummary() != null && !user.getSummary().isEmpty()) {
                                addSectionTitle(document, "SUMMARY");
                                XWPFParagraph p = document.createParagraph();
                                XWPFRun r = p.createRun();
                                r.setText(user.getSummary());
                                r.setFontSize(11);
                                document.createParagraph();
                        }

                        // === DENEYİMLER ===
                        if (user.getExperiences() != null && !user.getExperiences().isEmpty()) {
                                addSectionTitle(document, "EXPERIENCE");
                                for (Experience exp : user.getExperiences()) {
                                        XWPFParagraph p = document.createParagraph();
                                        XWPFRun r = p.createRun();
                                        r.setBold(true);
                                        r.setText(exp.getPosition() + " at " + exp.getCompanyName());
                                        r.setFontSize(12);

                                        XWPFRun rDate = p.createRun();
                                        rDate.setText("  |  " + formatDate(exp.getStartDate()) + " - "
                                                        + (exp.isCurrent() ? "Present" : formatDate(exp.getEndDate())));
                                        rDate.setItalic(true);
                                        rDate.setFontSize(10);
                                        rDate.setColor("666666");

                                        if (exp.getDescription() != null && !exp.getDescription().isEmpty()) {
                                                XWPFParagraph desc = document.createParagraph();
                                                XWPFRun descRun = desc.createRun();
                                                descRun.setText(exp.getDescription());
                                                descRun.setFontSize(10);
                                        }
                                        document.createParagraph();
                                }
                        }

                        // === EĞİTİM ===
                        if (user.getEducations() != null && !user.getEducations().isEmpty()) {
                                addSectionTitle(document, "EDUCATION");
                                for (Education edu : user.getEducations()) {
                                        XWPFParagraph p = document.createParagraph();
                                        XWPFRun r = p.createRun();
                                        r.setBold(true);
                                        r.setText(edu.getSchoolName());
                                        r.setFontSize(12);

                                        XWPFRun rDetail = p.createRun();
                                        rDetail.addBreak();
                                        rDetail.setText(edu.getDegree() + " in " + edu.getFieldOfStudy());

                                        XWPFRun rDate = p.createRun();
                                        rDate.setText("  (" + formatDate(edu.getStartDate()) + " - "
                                                        + (edu.isCurrent() ? "Present" : formatDate(edu.getEndDate()))
                                                        + ")");
                                        rDate.setItalic(true);
                                        rDate.setFontSize(10);
                                        rDate.setColor("666666");

                                        document.createParagraph();
                                }
                        }

                        // === YETENEKLER ===
                        if (user.getSkills() != null && !user.getSkills().isEmpty()) {
                                addSectionTitle(document, "SKILLS");
                                XWPFParagraph skillsPara = document.createParagraph();
                                XWPFRun skillsRun = skillsPara.createRun();
                                String skillsText = user.getSkills().stream()
                                                .map(Skill::getName)
                                                .collect(Collectors.joining(" • "));
                                skillsRun.setText(skillsText);
                                document.createParagraph();
                        }

                        // === DİLLER ===
                        if (user.getLanguages() != null && !user.getLanguages().isEmpty()) {
                                addSectionTitle(document, "LANGUAGES");
                                for (Language lang : user.getLanguages()) {
                                        XWPFParagraph p = document.createParagraph();
                                        XWPFRun r = p.createRun();
                                        r.setText(lang.getName() + " (" + lang.getLevel() + ")");
                                }
                                document.createParagraph();
                        }

                        // === SERTİFİKALAR ===
                        if (user.getCertificates() != null && !user.getCertificates().isEmpty()) {
                                addSectionTitle(document, "CERTIFICATES");
                                for (Certificate cert : user.getCertificates()) {
                                        XWPFParagraph p = document.createParagraph();
                                        XWPFRun r = p.createRun();
                                        r.setBold(true);
                                        r.setText(cert.getName());

                                        XWPFRun rDetail = p.createRun();
                                        rDetail.setText(" - " + cert.getIssuer());
                                        if (cert.getDate() != null) {
                                                rDetail.setText(" (" + formatDate(cert.getDate()) + ")");
                                        }
                                }
                        }

                        ByteArrayOutputStream out = new ByteArrayOutputStream();
                        document.write(out);
                        return out.toByteArray();
                }
        }

        private void addSectionTitle(XWPFDocument document, String titleText) {
                XWPFParagraph p = document.createParagraph();
                p.setBorderBottom(Borders.SINGLE);
                XWPFRun r = p.createRun();
                r.setText(titleText);
                r.setBold(true);
                r.setFontSize(14);
                r.setColor("2E7D32");
        }

        private String formatDate(java.time.LocalDate date) {
                if (date == null)
                        return "";
                return date.format(DateTimeFormatter.ofPattern("MMM yyyy"));
        }
}
