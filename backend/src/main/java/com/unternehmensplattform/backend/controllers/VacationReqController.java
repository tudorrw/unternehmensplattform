package com.unternehmensplattform.backend.controllers;

import com.unternehmensplattform.backend.entities.DTOs.CompanyDetailsDTO;
import com.unternehmensplattform.backend.entities.DTOs.UserDetailsDTO;
import com.unternehmensplattform.backend.entities.DTOs.UserWithVacationRequestDetailsDTO;
import com.unternehmensplattform.backend.entities.DTOs.VacationRequestDetailsDTO;
import com.unternehmensplattform.backend.entities.VacationRequest;
import com.unternehmensplattform.backend.services.interfaces.AuthenticationService;
import com.unternehmensplattform.backend.services.implementations.VacationReqServiceImpl;

import com.unternehmensplattform.backend.enums.VacationReqStatus;
import com.unternehmensplattform.backend.services.interfaces.VacationReqService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;


import java.util.List;

@RestController
@RequestMapping("vacation-request")
@RequiredArgsConstructor
public class VacationReqController {
    private final AuthenticationService authenticationService;
    private final UserDetailsService userDetailsService;
    private final VacationReqService vacationReqService;

    @GetMapping("/admin/{administratorId}")
    public ResponseEntity<List<VacationRequest>> getRequestsForAdmin(@PathVariable Integer administratorId) {
        List<VacationRequest> requests = vacationReqService.getRequestsByAdmin(administratorId);
        return ResponseEntity.ok(requests);
    }

    @GetMapping("/get-pending-requests")
    public ResponseEntity<List<VacationRequestDetailsDTO>> getAllPendingVacationRequests() {
        List<VacationRequestDetailsDTO> pendingVacationRequests = vacationReqService.getAllPendingVacationRequests();
        return ResponseEntity.ok(pendingVacationRequests);
    }
    @GetMapping("/get-employees-with-vacation-requests")
    public ResponseEntity<List<UserWithVacationRequestDetailsDTO>> getAllCompanies() {
        List<UserWithVacationRequestDetailsDTO> employees = vacationReqService.getAllEmployeesWithVacationRequests();
        if (employees.isEmpty()) {
            return ResponseEntity.noContent().build();
        }
        return ResponseEntity.ok(employees);
    }

    @PutMapping("/{requestId}/status")
    public ResponseEntity<Void> updateRequestStatus(
            @PathVariable Integer requestId,
            @RequestParam VacationReqStatus status) {
        vacationReqService.updateRequestStatus(requestId, status);
        return ResponseEntity.ok().build();
    }
}
