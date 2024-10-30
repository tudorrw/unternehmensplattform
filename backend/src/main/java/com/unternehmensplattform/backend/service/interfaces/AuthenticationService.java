package com.unternehmensplattform.backend.service.interfaces;

import com.unternehmensplattform.backend.entities.DTOs.AuthenticationRequest;
import com.unternehmensplattform.backend.entities.DTOs.AuthenticationResponse;
import com.unternehmensplattform.backend.entities.DTOs.RegistrationRequest;

public interface AuthenticationService {
    void register(RegistrationRequest registrationRequest);

    AuthenticationResponse authenticate(AuthenticationRequest authenticationRequest);
}
