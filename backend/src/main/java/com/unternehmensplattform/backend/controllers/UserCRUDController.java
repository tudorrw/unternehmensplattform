package com.unternehmensplattform.backend.controllers;

import com.unternehmensplattform.backend.entities.DTOs.RegistrationRequest;
import com.unternehmensplattform.backend.entities.DTOs.UserDetailsDTO;
import com.unternehmensplattform.backend.entities.User;
import com.unternehmensplattform.backend.services.interfaces.AuthenticationService;
import com.unternehmensplattform.backend.services.interfaces.UserService;
import com.unternehmensplattform.backend.services.implementations.CreateEmployeeServiceImpl;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("users")
@RequiredArgsConstructor
public class UserCRUDController {
    private final UserService userService;
    private final AuthenticationService authenticationService;
    private final CreateEmployeeServiceImpl createEmployeeService;

    @GetMapping("/get-employees")
    public ResponseEntity<List<UserDetailsDTO>> getAllEmployees() {
        List<UserDetailsDTO> employees = userService.getAllEmployees();
        return ResponseEntity.ok(employees);
    }

    @GetMapping("/me")
    public ResponseEntity<UserDetailsDTO> authenticatedUser() {
        // Retrieve the currently authenticated user
        User currentUser = (User) SecurityContextHolder.getContext().getAuthentication().getPrincipal();
        
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

    /**
     * Endpoint for admin to create a new employee.
     * Only accessible by users with the ADMIN role.
     */
    @PreAuthorize("hasAuthority('ROLE_ADMIN')")
    @PostMapping("/create-employee")
    public ResponseEntity<User> createEmployee(
            @RequestParam String firstName,
            @RequestParam String lastName,
            @RequestParam String email,
            @RequestParam String password,
            @RequestParam String telefonNumber) {

        try {
            User newEmployee = createEmployeeService.createEmployee(firstName, lastName, email, password, telefonNumber);
            return new ResponseEntity<>(newEmployee, HttpStatus.CREATED);
        } catch (IllegalArgumentException e) {
            return new ResponseEntity<>(null, HttpStatus.BAD_REQUEST);
        }
    }
}
