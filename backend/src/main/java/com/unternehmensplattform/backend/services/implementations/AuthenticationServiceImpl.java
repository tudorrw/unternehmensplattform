package com.unternehmensplattform.backend.services.implementations;

import com.unternehmensplattform.backend.entities.DTOs.AuthenticationRequest;
import com.unternehmensplattform.backend.entities.DTOs.AuthenticationResponse;
import com.unternehmensplattform.backend.entities.DTOs.RegistrationRequest;
import com.unternehmensplattform.backend.entities.User;
import com.unternehmensplattform.backend.enums.UserRole;
import com.unternehmensplattform.backend.repositories.UserRepository;
import com.unternehmensplattform.backend.security.JwtService;
import com.unternehmensplattform.backend.services.interfaces.AuthenticationService;
import lombok.RequiredArgsConstructor;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.util.HashMap;

@Service
@RequiredArgsConstructor
public class AuthenticationServiceImpl implements AuthenticationService {
    private final PasswordEncoder passwordEncoder;
    private final UserRepository userRepository;

    private final AuthenticationManager authenticationManager;
    private final JwtService jwtService;

    public void register(RegistrationRequest registrationRequest) {
        UserRole roleToAssign = getRole();
        var user = User.builder()
                .firstName(registrationRequest.getFirstName())
                .lastName(registrationRequest.getLastName())
                .email(registrationRequest.getEmail())
                .passwordHash(passwordEncoder.encode(registrationRequest.getPasswordHash()))
                .accountLocked(false)
                .enabled(true)
                .role(roleToAssign)
                .build();
        userRepository.save(user);
    }

    public void registerSuperadmins(RegistrationRequest registrationRequest) {
        var user = User.builder()
                .firstName(registrationRequest.getFirstName())
                .lastName(registrationRequest.getLastName())
                .email(registrationRequest.getEmail())
                .passwordHash(passwordEncoder.encode(registrationRequest.getPasswordHash()))
                .accountLocked(false)
                .enabled(true)
                .role(UserRole.Superadmin)
                .build();
        userRepository.save(user);
    }

    private static UserRole getRole() {
        var currentUser = (User) SecurityContextHolder.getContext().getAuthentication().getPrincipal();
        UserRole roleToAssign;
        // Check if the current user has permission to create the requested role
        if (currentUser.getRole() == UserRole.Superadmin) {
            roleToAssign = UserRole.Administrator; // Superadmin can create administrators
        } else if (currentUser.getRole() == UserRole.Administrator) {
            roleToAssign = UserRole.Employee; // Administrator can create employees
        } else {
            throw new IllegalArgumentException("You do not have permission to create users.");
        }
        return roleToAssign;
    }

    public AuthenticationResponse authenticate(AuthenticationRequest authenticationRequest) {
        var auth = authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(
                        authenticationRequest.getEmail(),
                        authenticationRequest.getPasswordHash()
                )
        );
        var claims = new HashMap<String, Object>();
        var user = ((User)auth.getPrincipal());
        claims.put("full_name", user.getFirstName() + " " + user.getLastName());
        var jwtToken = jwtService.generateToken(claims, user);
        return AuthenticationResponse.builder()
                .token(jwtToken).build();
    }
}
