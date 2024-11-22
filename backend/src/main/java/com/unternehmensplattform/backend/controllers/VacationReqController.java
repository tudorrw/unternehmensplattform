package com.unternehmensplattform.backend.controllers;


import com.unternehmensplattform.backend.entities.DTOs.VacationRequestDTO;
import com.unternehmensplattform.backend.entities.User;
import com.unternehmensplattform.backend.handler.InvalidVacationRequestException;
import com.unternehmensplattform.backend.handler.VacationRequestOverlapException;
import com.unternehmensplattform.backend.services.interfaces.VacationReqService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("vacation-request")
@RequiredArgsConstructor
public class VacationReqController {
    private final VacationReqService vacationReqService;


    @PostMapping("/create")
    @ResponseStatus(HttpStatus.CREATED)
    public ResponseEntity<Void> createVacationRequest(
            @RequestBody @Valid VacationRequestDTO vacationRequestDTO
    ) {
        try {
            User loggedInUser = (User) SecurityContextHolder.getContext().getAuthentication().getPrincipal();
            vacationReqService.createVacationRequest(vacationRequestDTO, loggedInUser);
            return ResponseEntity.status(HttpStatus.CREATED).build();
        } catch (InvalidVacationRequestException | VacationRequestOverlapException e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).build();
        }
    }

}
