package com.unternehmensplattform.backend.controllers;

import com.unternehmensplattform.backend.services.interfaces.AuthenticationService;
import com.unternehmensplattform.backend.services.interfaces.WorkingDaysService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("working_days")
@RequiredArgsConstructor
public class WorkingDaysController {
    private final AuthenticationService authenticationService;
    private final UserDetailsService userDetailsService;
    private final WorkingDaysService workingDaysService;


    @PostMapping("/delete/{requestId}")
    public ResponseEntity<?> deleteVacationRequest(@PathVariable Integer requestId) {
        workingDaysService.deleteWorkingDay(requestId);
        return ResponseEntity.accepted().build();
    }
}
