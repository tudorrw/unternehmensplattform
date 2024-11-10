package com.unternehmensplattform.backend.services.implementations;

import com.unternehmensplattform.backend.entities.Company;
import com.unternehmensplattform.backend.entities.Contract;
import com.unternehmensplattform.backend.entities.DTOs.CompanyDTO;
import com.unternehmensplattform.backend.entities.DTOs.CompanyWithAdminDTO;
import com.unternehmensplattform.backend.entities.User;
import com.unternehmensplattform.backend.repositories.CompanyRepository;
import com.unternehmensplattform.backend.repositories.ContractRepository;
import com.unternehmensplattform.backend.repositories.UserRepository;
import com.unternehmensplattform.backend.services.interfaces.CompanyService;
import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class CompanyServiceImpl implements CompanyService {
    private final CompanyRepository companyRepository;
    private final UserRepository userRepository;
    private final AuthenticationServiceImpl authenticationService;
    private final ContractRepository contractRepository;

    @Override
    public List<CompanyDTO> getAllCompanies() {
        List<Company> companies = companyRepository.findAll();
        return companies.stream().map(this::convertToDTO).collect(Collectors.toList());
    }

    @Override
    @Transactional
    public Company createCompanyWithAdmin(CompanyWithAdminDTO companyWithAdminDTO) {

        Company company = Company.builder()
                .name(companyWithAdminDTO.getCompanyDTO().getName())
                .telefonNumber(companyWithAdminDTO.getCompanyDTO().getTelefonNumber())
                .address(companyWithAdminDTO.getCompanyDTO().getAddress())
                .build();
        companyRepository.save(company);

        if (companyWithAdminDTO.getAdminRegistration() != null) {
            authenticationService.register(companyWithAdminDTO.getAdminRegistration());
        } else {
            throw new IllegalArgumentException("Admin registration details must be provided.");
        }

        User createdAdmin = userRepository.findByEmail(companyWithAdminDTO.getAdminRegistration().getEmail())
                .orElseThrow(() -> new RuntimeException("Admin user creation failed"));

        assignAdminToCompany(createdAdmin, company);

        return company;
    }

    @Transactional
    public void assignAdminToCompany(Integer companyId, Integer adminId) {
        // Retrieve company by ID
        Company company = companyRepository.findById(companyId)
                .orElseThrow(() -> new RuntimeException("Company not found"));

        // Retrieve admin by ID
        User admin = userRepository.findById(adminId)
                .orElseThrow(() -> new RuntimeException("Admin not found"));

        // Create and save contract to assign admin to company
        Contract contract = new Contract();
        contract.setCompany(company);
        contract.setUser(admin);

        contractRepository.save(contract);
    }

    private void assignAdminToCompany(User createdAdmin, Company company) {
        Contract contract = Contract.builder()
                .company(company)
                .user(createdAdmin)
                .build();

        contractRepository.save(contract);
    }

    private CompanyDTO convertToDTO(Company company) {
        return CompanyDTO.builder()
                .name(company.getName())
                .telefonNumber(company.getTelefonNumber())
                .address(company.getAddress())
                .build();
    }
}
