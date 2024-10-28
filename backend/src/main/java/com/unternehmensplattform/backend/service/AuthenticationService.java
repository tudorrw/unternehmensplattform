package com.unternehmensplattform.backend.service;

import com.unternehmensplattform.backend.entities.DTOs.AuthenticationRequest;
import com.unternehmensplattform.backend.entities.DTOs.AuthenticationResponse;
import com.unternehmensplattform.backend.entities.DTOs.RegistrationRequest;
import com.unternehmensplattform.backend.entities.User;
import com.unternehmensplattform.backend.repositories.RoleRepository;
import com.unternehmensplattform.backend.repositories.UserRepository;
import com.unternehmensplattform.backend.security.JwtService;
import lombok.RequiredArgsConstructor;
import org.apache.tomcat.util.net.openssl.ciphers.Authentication;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.util.HashMap;

@Service
@RequiredArgsConstructor
public class AuthenticationService {
    private final RoleRepository roleRepository;
    private final PasswordEncoder passwordEncoder;
    private final UserRepository userRepository;

    private final AuthenticationManager authenticationManager;
    private final JwtService jwtService;

    public void register(RegistrationRequest registrationRequest) {
        var userRole = roleRepository.findByName("Employee")
                .orElseThrow(() -> new RuntimeException("Role User was mot initialized"));
        var user = User.builder()
                .first_name(registrationRequest.getFirst_name())
                .last_name(registrationRequest.getLast_name())
                .email(registrationRequest.getEmail())
                .password_hash(passwordEncoder.encode(registrationRequest.getPassword_hash()))
                .accountLocked(false)
                .enabled(true)
                .role(userRole)
                .build();
        userRepository.save(user);
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
