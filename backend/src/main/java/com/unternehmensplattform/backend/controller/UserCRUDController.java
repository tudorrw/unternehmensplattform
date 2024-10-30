package com.unternehmensplattform.backend.controller;

import com.unternehmensplattform.backend.entities.DTOs.RegistrationRequest;
import com.unternehmensplattform.backend.entities.DTOs.UserDetailsDTO;
import com.unternehmensplattform.backend.entities.User;
import com.unternehmensplattform.backend.service.interfaces.AuthenticationService;
import com.unternehmensplattform.backend.service.interfaces.UserService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.*;

import java.util.List;

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
}
