package com.unternehmensplattform.backend.controllers;

import com.unternehmensplattform.backend.entities.DTOs.WorkingDaysDTO;
import com.unternehmensplattform.backend.entities.User;
import com.unternehmensplattform.backend.services.interfaces.AuthenticationService;
import com.unternehmensplattform.backend.services.interfaces.WorkingDaysService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("working_days")
@RequiredArgsConstructor
public class WorkingDaysController {
    private final AuthenticationService authenticationService;
    private final UserDetailsService userDetailsService;
    private final WorkingDaysService workingDaysService;

    @PostMapping("/start")
    @ResponseStatus(HttpStatus.CREATED)
    public ResponseEntity<String> startWorkingDay(@RequestBody @Valid WorkingDaysDTO dto) {
        User loggedInUser = (User) SecurityContextHolder.getContext().getAuthentication().getPrincipal();

        try {
            workingDaysService.startWorkingDay(dto, loggedInUser);
            return ResponseEntity.status(HttpStatus.CREATED).body("Working day started successfully.");
        } catch (IllegalArgumentException e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(e.getMessage());
        }
    }

    @PostMapping("/stop")
    @ResponseStatus(HttpStatus.OK)
    public ResponseEntity<String> stopWorkingDay(@RequestBody @Valid WorkingDaysDTO dto) {
        User loggedInUser = (User) SecurityContextHolder.getContext().getAuthentication().getPrincipal();

        try {
            workingDaysService.stopWorkingDay(dto, loggedInUser);
            return ResponseEntity.ok("You have been clocked out. Please provide a description to finalize your working day.");
        } catch (IllegalArgumentException e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(e.getMessage());
        }
    }

    @PostMapping("/finalize")
    @ResponseStatus(HttpStatus.OK)
    public ResponseEntity<String> finalizeWorkingDay(@RequestBody @Valid WorkingDaysDTO dto) {
        User loggedInUser = (User) SecurityContextHolder.getContext().getAuthentication().getPrincipal();

        try {
            workingDaysService.finalizeWorkingDay(dto, loggedInUser);
            return ResponseEntity.ok("Working day finalized successfully.");
        } catch (IllegalArgumentException e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(e.getMessage());
        }
    }


}
