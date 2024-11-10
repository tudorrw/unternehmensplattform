package com.unternehmensplattform.backend.controllers;

import com.unternehmensplattform.backend.entities.DTOs.RegistrationRequest;
import com.unternehmensplattform.backend.entities.DTOs.UserDetailsDTO;
import com.unternehmensplattform.backend.entities.User;
import com.unternehmensplattform.backend.enums.UserRole;
import com.unternehmensplattform.backend.services.interfaces.AuthenticationService;
import com.unternehmensplattform.backend.services.interfaces.UserService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.stream.Collectors;

@RestController
@RequestMapping("users")
@RequiredArgsConstructor
public class UserCRUDController {
    private final UserService userService;
    private final AuthenticationService authenticationService;

    @GetMapping("/get-employees")
    public ResponseEntity<List<UserDetailsDTO>> getAllEmployees() {
        List<UserDetailsDTO> employees = userService.getAllEmployees();
        return ResponseEntity.ok(employees);
    }

    @GetMapping("/me")
    public ResponseEntity<UserDetailsDTO> authenticatedUser() {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();

        User currentUser = (User) authentication.getPrincipal();
        UserDetailsDTO userDetailsDTO = new UserDetailsDTO(
                currentUser.getFirstName(),
                currentUser.getLastName(),
                currentUser.getEmail(),
                currentUser.getTelefonNumber(),
                currentUser.isAccountLocked(),
                currentUser.getRole()
        );
        return ResponseEntity.ok(userDetailsDTO);
    }

    @PostMapping("/register")
    @ResponseStatus(HttpStatus.ACCEPTED)
    public ResponseEntity<?> register(
            @RequestBody @Valid RegistrationRequest request) {
        authenticationService.register(request);
        return ResponseEntity.accepted().build();
    }

    @GetMapping("/admins")
    public ResponseEntity<List<UserDetailsDTO>> getAllAdmins() {
        List<UserDetailsDTO> admins = userService.getAllAdmins();
        if (admins.isEmpty()) {
            return ResponseEntity.noContent().build();
        }
        return ResponseEntity.ok(admins);
    }
}
