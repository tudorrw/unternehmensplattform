package com.unternehmensplattform.backend.controllers;


import com.unternehmensplattform.backend.entities.Company;
import com.unternehmensplattform.backend.entities.DTOs.CompanyDTO;
import com.unternehmensplattform.backend.entities.DTOs.CompanyWithAdminDTO;
import com.unternehmensplattform.backend.services.interfaces.AuthenticationService;
import com.unternehmensplattform.backend.services.interfaces.CompanyService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("company")
@RequiredArgsConstructor
public class CompanyController {
    private final AuthenticationService authenticationService;
    private final UserDetailsService userDetailsService;
    private final CompanyService companyService;

    @PostMapping("/create")
    @PreAuthorize("hasAuthority('Superadmin')")
    public ResponseEntity<Company> createCompany(@RequestBody @Valid CompanyWithAdminDTO companyWithAdminDTO) {
        Company company = companyService.createCompanyWithAdmin(companyWithAdminDTO);
        return ResponseEntity.status(HttpStatus.CREATED).body(company);
    }

    @GetMapping("/get-all")
    public ResponseEntity<List<CompanyDTO>> getAllCompanies() {
        List<CompanyDTO> companies = companyService.getAllCompanies();
        if (companies.isEmpty()) {
            return ResponseEntity.noContent().build();
        }
        return ResponseEntity.ok(companies);
    }

    @PreAuthorize("hasAuthority('Superadmin')")
    @PostMapping("/{companyId}/assign-admin/{adminId}")
    public ResponseEntity<String> assignAdminToCompany(
            @PathVariable Integer companyId,
            @PathVariable Integer adminId) {

        try {
            companyService.assignAdminToCompany(companyId, adminId);
            return ResponseEntity.ok("Admin assigned successfully");
        } catch (RuntimeException e) {
            return ResponseEntity.status(404).body(e.getMessage());
        }
    }
}
