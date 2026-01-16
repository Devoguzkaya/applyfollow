package com.applyfollow.backend.service;

import com.applyfollow.backend.model.Company;
import com.applyfollow.backend.repository.CompanyRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
public class CompanyService {

    private final CompanyRepository companyRepository;

    public CompanyService(CompanyRepository companyRepository) {
        this.companyRepository = companyRepository;
    }

    @Transactional
    public Company findOrCreateCompany(String companyName) {
        return companyRepository.findByNameIgnoreCase(companyName)
                .orElseGet(() -> {
                    Company newCompany = new Company();
                    newCompany.setName(companyName);
                    return companyRepository.save(newCompany);
                });
    }

    public java.util.List<com.applyfollow.backend.dto.CompanyResponse> getAllCompanies() {
        return companyRepository.findAll().stream()
                .map(this::mapToResponse)
                .collect(java.util.stream.Collectors.toList());
    }

    private com.applyfollow.backend.dto.CompanyResponse mapToResponse(Company company) {
        return new com.applyfollow.backend.dto.CompanyResponse(
                company.getId(),
                company.getName(),
                company.getWebsite(),
                company.getLinkedinUrl(),
                company.getLogoUrl(),
                company.getCreatedAt());
    }
}

