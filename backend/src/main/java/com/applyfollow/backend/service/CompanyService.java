package com.applyfollow.backend.service;

import com.applyfollow.backend.model.Company;
import com.applyfollow.backend.repository.CompanyRepository;
import com.applyfollow.backend.dto.CompanyResponse;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
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

    public Page<CompanyResponse> getAllCompanies(Pageable pageable) {
        return companyRepository.findAll(pageable)
                .map(this::mapToResponse);
    }

    private CompanyResponse mapToResponse(Company company) {
        return new CompanyResponse(
                company.getId(),
                company.getName(),
                company.getWebsite(),
                company.getLinkedinUrl(),
                company.getLogoUrl(),
                company.getCreatedAt());
    }
}
