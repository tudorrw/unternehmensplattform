package com.unternehmensplattform.backend.service;

import com.unternehmensplattform.backend.entities.DTOs.AuthenticationRequest;
import com.unternehmensplattform.backend.entities.DTOs.AuthenticationResponse;
import com.unternehmensplattform.backend.entities.DTOs.RegistrationRequest;
import com.unternehmensplattform.backend.entities.User;
import com.unternehmensplattform.backend.enums.Role;
import com.unternehmensplattform.backend.repositories.UserRepository;
import com.unternehmensplattform.backend.security.JwtService;
import lombok.RequiredArgsConstructor;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.util.HashMap;

@Service
@RequiredArgsConstructor
public class AuthenticationService {
    private final PasswordEncoder passwordEncoder;
    private final UserRepository userRepository;

    private final AuthenticationManager authenticationManager;
    private final JwtService jwtService;

    public void register(RegistrationRequest registrationRequest) {
//        Role roleToAssign = getRole();
        var user = User.builder()
                .first_name(registrationRequest.getFirst_name())
                .last_name(registrationRequest.getLast_name())
                .email(registrationRequest.getEmail())
                .password_hash(passwordEncoder.encode(registrationRequest.getPassword_hash()))
                .accountLocked(false)
                .enabled(true)
                .role(Role.Employee)
                .build();
        userRepository.save(user);
    }

    private static Role getRole() {
        var currentUser = (User) SecurityContextHolder.getContext().getAuthentication().getPrincipal();
        Role roleToAssign;
        // Check if the current user has permission to create the requested role
        if (currentUser.getRole() == Role.Superadmin) {
            roleToAssign = Role.Administrator; // Superadmin can create administrators
        } else if (currentUser.getRole() == Role.Administrator) {
            roleToAssign = Role.Employee; // Administrator can create employees
        } else {
            throw new IllegalArgumentException("You do not have permission to create users.");
        }
        return roleToAssign;
    }

    public AuthenticationResponse authenticate(AuthenticationRequest authenticationRequest) {
        var auth = authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(
                        authenticationRequest.getEmail(),
                        authenticationRequest.getPassword_hash()
                )
        );
        var claims = new HashMap<String, Object>();
        var user = ((User)auth.getPrincipal());
        claims.put("full_name", user.getFirst_name() + " " + user.getLast_name());
        var jwtToken = jwtService.generateToken(claims, user);
        return AuthenticationResponse.builder()
                .token(jwtToken).build();
    }
}
