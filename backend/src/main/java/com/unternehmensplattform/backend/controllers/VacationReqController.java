package com.unternehmensplattform.backend.controllers;


import com.unternehmensplattform.backend.entities.DTOs.UserDetailsDTO;
import com.unternehmensplattform.backend.entities.DTOs.VacationRequestDTO;
import com.unternehmensplattform.backend.entities.User;
import com.unternehmensplattform.backend.entities.VacationRequest;
import com.unternehmensplattform.backend.handler.InvalidVacationRequestException;
import com.unternehmensplattform.backend.handler.ResourceNotFoundException;
import com.unternehmensplattform.backend.handler.VacationRequestOverlapException;
import com.unternehmensplattform.backend.services.interfaces.VacationReqService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;
import lombok.extern.slf4j.Slf4j;


import java.util.List;

@Slf4j
@RestController
@RequestMapping("vacation-request")
@RequiredArgsConstructor
public class VacationReqController {
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


    @PostMapping("/create")
    public ResponseEntity<Void> createVacationRequest(@RequestBody @Valid VacationRequestDTO vacationRequestDTO) {
        try {
            User loggedInUser = (User) SecurityContextHolder.getContext().getAuthentication().getPrincipal();
            vacationReqService.createVacationRequest(vacationRequestDTO, loggedInUser);
            return ResponseEntity.status(HttpStatus.CREATED).build();
        } catch (InvalidVacationRequestException | VacationRequestOverlapException e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).build();
        }
    }


    @GetMapping("/available-administrators")
    public ResponseEntity<List<UserDetailsDTO>> getAvailableAdministrators() {

        User loggedInUser = (User) SecurityContextHolder.getContext().getAuthentication().getPrincipal();
        List<UserDetailsDTO> availableAdmins = vacationReqService.getAvailableAdministrators(loggedInUser);
        if (availableAdmins.isEmpty()) {
            throw new ResourceNotFoundException("No administrators available for your company.");
        }
        return ResponseEntity.ok(availableAdmins);
    }
}
