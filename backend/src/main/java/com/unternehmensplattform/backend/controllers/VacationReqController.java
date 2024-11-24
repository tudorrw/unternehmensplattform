package com.unternehmensplattform.backend.controllers;


import com.unternehmensplattform.backend.enums.VacationReqStatus;
import com.unternehmensplattform.backend.services.interfaces.VacationReqService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;


@RestController
@RequestMapping("vacation_request")
@RequiredArgsConstructor
public class VacationReqController {
    private final VacationReqService vacationReqService;


    @PutMapping("/{requestId}/status")
    public ResponseEntity<Void> updateRequestStatus(
            @PathVariable Integer requestId,
            @RequestParam VacationReqStatus status) {
        vacationReqService.updateRequestStatus(requestId, status);
        return ResponseEntity.ok().build();
    }
}
