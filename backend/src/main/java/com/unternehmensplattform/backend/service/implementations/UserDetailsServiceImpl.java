package com.unternehmensplattform.backend.service.implementations;


import com.unternehmensplattform.backend.entities.DTOs.RegistrationRequest;
import com.unternehmensplattform.backend.entities.DTOs.UserDetailsDTO;
import com.unternehmensplattform.backend.entities.User;
import com.unternehmensplattform.backend.enums.Role;
import com.unternehmensplattform.backend.repositories.UserRepository;
import com.unternehmensplattform.backend.service.interfaces.UserService;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.ArrayList;
import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class UserDetailsServiceImpl implements UserDetailsService, UserService {
    private final UserRepository userRepository;

    @Override
    @Transactional
    public UserDetails loadUserByUsername(String userEmail) throws UsernameNotFoundException {
        return userRepository.findByEmail(userEmail)
                .orElseThrow(() -> new UsernameNotFoundException("User not found"));
    }


    @Override
    public List<UserDetailsDTO> getAllEmployees() {
        return userRepository.findAll().stream()
                .filter(user -> user.getRole() == Role.Employee)
                .map(user -> new UserDetailsDTO(
                        user.getFirstName(),
                        user.getLastName(),
                        user.getEmail(),
                        user.getTelefonNumber(),
                        user.isAccountLocked(),
                        user.getRole()
                       ) {
                })
                .collect(Collectors.toList());
    }
}
