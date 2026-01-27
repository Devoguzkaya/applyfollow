package com.applyfollow.backend.controller;

import com.applyfollow.backend.dto.CompanyResponse;
import com.applyfollow.backend.service.CompanyService;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.web.PageableDefault;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/companies")
public class CompanyController {

    private final CompanyService companyService;

    public CompanyController(CompanyService companyService) {
        this.companyService = companyService;
    }

    @GetMapping
    public Page<CompanyResponse> getAllCompanies(@PageableDefault(size = 20) Pageable pageable) {
        return companyService.getAllCompanies(pageable);
    }
}
