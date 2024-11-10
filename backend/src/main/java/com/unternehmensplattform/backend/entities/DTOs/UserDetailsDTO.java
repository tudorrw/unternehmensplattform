package com.unternehmensplattform.backend.entities.DTOs;

import com.unternehmensplattform.backend.enums.UserRole;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;



@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class UserDetailsDTO {
    private int id;
    private String firstName;
    private String lastName;
    private String email;
    private String telefonNumber;
    private boolean accountLocked;
    private UserRole role;
}
