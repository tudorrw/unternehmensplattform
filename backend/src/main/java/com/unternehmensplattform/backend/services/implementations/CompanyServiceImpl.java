package com.unternehmensplattform.backend.services.implementations;

import com.unternehmensplattform.backend.repositories.CompanyRepository;
import com.unternehmensplattform.backend.services.interfaces.CompanyService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class CompanyServiceImpl implements CompanyService {
    private final CompanyRepository companyRepository;
}
