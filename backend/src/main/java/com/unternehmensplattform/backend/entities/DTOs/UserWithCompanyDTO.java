package com.unternehmensplattform.backend.entities.DTOs;

import com.unternehmensplattform.backend.enums.UserRole;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class UserWithCompanyDTO {
    private Integer id;
    private String firstName;
    private String lastName;
    private String email;
    private String telefonNumber;
    private boolean accountLocked;
    private UserRole role;
    private String companyName;
}