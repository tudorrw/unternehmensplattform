package com.unternehmensplattform.backend.service.interfaces;

import com.unternehmensplattform.backend.entities.DTOs.UserDetailsDTO;

import java.util.List;

public interface UserService {
    List<UserDetailsDTO> getAllEmployees();

}
