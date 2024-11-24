package com.unternehmensplattform.backend.controllers;

import com.unternehmensplattform.backend.entities.VacationRequest;
import com.unternehmensplattform.backend.services.interfaces.AuthenticationService;
import com.unternehmensplattform.backend.services.implementations.VacationReqServiceImpl;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("vacation_request")
@RequiredArgsConstructor
public class VacationReqController {
    private final AuthenticationService authenticationService;
    private final UserDetailsService userDetailsService;
    private final VacationReqServiceImpl vacationReqService;

    @GetMapping("/admin/{administratorId}")
    public ResponseEntity<List<VacationRequest>> getRequestsForAdmin(@PathVariable Integer administratorId) {
        List<VacationRequest> requests = vacationReqService.getRequestsByAdmin(administratorId);
        return ResponseEntity.ok(requests);
    }
}
