package com.unternehmensplattform.backend.entities.DTOs;


import jakarta.validation.Valid;
import jakarta.validation.constraints.NotNull;
import lombok.Builder;
import lombok.Data;

@Data
@Builder
public class CompanyWithAdminDTO {

    @Valid
    @NotNull
    private CompanyDTO companyDTO;

    @Valid
    private RegistrationRequest adminRegistration;

}
