package com.unternehmensplattform.backend.services.interfaces;

import com.unternehmensplattform.backend.entities.Company;
import com.unternehmensplattform.backend.entities.DTOs.CompanyDTO;
import com.unternehmensplattform.backend.entities.DTOs.CompanyWithAdminDTO;
import jakarta.validation.Valid;

import java.util.List;

public interface CompanyService {
    List<CompanyDTO> getAllCompanies();

    Company createCompanyWithAdmin(@Valid CompanyWithAdminDTO companyWithAdminDTO);

    void assignAdminToCompany(Integer companyId, Integer adminId);
}
