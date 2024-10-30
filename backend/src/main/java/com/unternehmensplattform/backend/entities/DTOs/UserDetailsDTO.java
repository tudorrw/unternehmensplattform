package com.unternehmensplattform.backend.entities.DTOs;

import com.unternehmensplattform.backend.enums.Role;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;



@Data
@NoArgsConstructor
@AllArgsConstructor
public class UserDetailsDTO {
    private String firstName;
    private String lastName;
    private String email;
    private String telefonNumber;
    private boolean accountLocked;
    private Role role;
}
