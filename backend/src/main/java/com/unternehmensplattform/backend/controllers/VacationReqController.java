package com.unternehmensplattform.backend.controllers;


import com.unternehmensplattform.backend.entities.VacationRequest;
import com.unternehmensplattform.backend.services.interfaces.AuthenticationService;
import com.unternehmensplattform.backend.services.interfaces.VacationReqService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("vacation_request")
@RequiredArgsConstructor
public class VacationReqController {
    private final AuthenticationService authenticationService;
    private final UserDetailsService userDetailsService;
    private final VacationReqService vacationReqService;

    @GetMapping("/employee/{employeeId}")
    //@PreAuthorize("hasAuthority('Employee')")
    public ResponseEntity<?> getVacationRequestsByEmployee(@PathVariable Integer employeeId) {
        try {
            List<VacationRequest> requests = vacationReqService.getVacationRequestsByEmployee(employeeId);
            if (requests.isEmpty()) {
                return ResponseEntity.status(HttpStatus.NOT_FOUND).body("No vacation requests found for this employee.");
            }
            return ResponseEntity.ok(requests);
        } catch (RuntimeException e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(e.getMessage());
        }
    }


    @DeleteMapping("/delete/{requestId}")
    public ResponseEntity<String> deleteVacationRequest(@PathVariable Integer requestId) {
        try {
            vacationReqService.deleteVacationRequest(requestId);
            return ResponseEntity.ok("Vacation request deleted successfully.");
        } catch (RuntimeException e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(e.getMessage());
        }
    }
}
