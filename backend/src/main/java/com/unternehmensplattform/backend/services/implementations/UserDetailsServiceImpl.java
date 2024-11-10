package com.unternehmensplattform.backend.services.implementations;


import com.unternehmensplattform.backend.entities.DTOs.UserDetailsDTO;
import com.unternehmensplattform.backend.entities.User;
import com.unternehmensplattform.backend.enums.UserRole;
import com.unternehmensplattform.backend.repositories.UserRepository;
import com.unternehmensplattform.backend.services.interfaces.UserService;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

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
                .filter(user -> user.getRole() == UserRole.Employee)
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

    public List<UserDetailsDTO> getAllAdmins() {

        List<User> adminUsers = userRepository.findByRole(UserRole.Administrator);

        return adminUsers.stream()
                .map(this::convertToDTO)
                .collect(Collectors.toList());
    }

    private UserDetailsDTO convertToDTO(User adminUser) {
        return UserDetailsDTO.builder()
                .firstName(adminUser.getFirstName())
                .lastName(adminUser.getLastName())
                .email(adminUser.getEmail())
                .telefonNumber(adminUser.getTelefonNumber())
                .accountLocked(adminUser.isAccountLocked())
                .role(adminUser.getRole())
                .build();
    }
}
