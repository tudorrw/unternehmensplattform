package com.unternehmensplattform.backend.service.interfaces;

import com.unternehmensplattform.backend.entities.DTOs.RegistrationRequest;
import com.unternehmensplattform.backend.entities.User;

import java.util.List;

public interface UserService {
    List<User> getAllUsers();

}
