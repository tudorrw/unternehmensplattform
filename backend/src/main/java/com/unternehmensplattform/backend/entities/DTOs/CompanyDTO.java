package com.unternehmensplattform.backend.entities.DTOs;

import jakarta.persistence.Column;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;

public class CompanyDTO {
    private String name;
    private String telefonNumber;
    private String address;
}
