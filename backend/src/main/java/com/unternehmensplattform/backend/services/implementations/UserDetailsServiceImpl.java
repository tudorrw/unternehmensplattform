package com.unternehmensplattform.backend.services.implementations;


import com.unternehmensplattform.backend.entities.Company;
import com.unternehmensplattform.backend.entities.Contract;
import com.unternehmensplattform.backend.entities.DTOs.UserDetailsDTO;
import com.unternehmensplattform.backend.entities.User;
import com.unternehmensplattform.backend.enums.UserRole;
import com.unternehmensplattform.backend.repositories.UserRepository;
import com.unternehmensplattform.backend.services.interfaces.UserService;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
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
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        User currentUser = (User) authentication.getPrincipal();

        if (currentUser.getRole() == UserRole.Administrator) {
            Contract contract = currentUser.getContract();
            Company company = contract.getCompany();
            List<User> employees = userRepository.findEmployeesByCompany(UserRole.Employee, company);

            return employees.stream()
                    .map(user -> new UserDetailsDTO(
                            user.getId(),
                            user.getFirstName(),
                            user.getLastName(),
                            user.getEmail(),
                            user.getTelefonNumber(),
                            user.isAccountLocked(),
                            user.getRole()
                    ))
                    .collect(Collectors.toList());
        } else {
            throw new RuntimeException("User is not an administrator");
        }
    }

    @Override
    @Transactional
    public void modifyUser(UserDetailsDTO userDetailsDTO) {
        User user = userRepository.findById(userDetailsDTO.getId())
                .orElseThrow(() -> new RuntimeException("User not found"));

        user.setFirstName(userDetailsDTO.getFirstName());
        user.setLastName(userDetailsDTO.getLastName());
        user.setEmail(userDetailsDTO.getEmail());
        user.setTelefonNumber(userDetailsDTO.getTelefonNumber());
        userRepository.save(user);
    }

    @Override
    @Transactional
    public void deactivateUser(Integer userId) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("User not found"));
        if(user.isAccountNonLocked()) {
            user.setEnabled(false);
            user.setAccountLocked(true);
        }
        userRepository.save(user);

    }

    @Override
    @Transactional
    public void activateUser(Integer userId) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("User not found"));
        if(user.isAccountLocked()) {
            user.setEnabled(true);
            user.setAccountLocked(false);
        }
        userRepository.save(user);
    }
}
