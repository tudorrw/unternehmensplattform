package com.unternehmensplattform.backend.services.interfaces;

import com.unternehmensplattform.backend.entities.DTOs.UserDetailsDTO;

import java.util.List;

public interface UserService {
    List<UserDetailsDTO> getAllEmployees();

}
