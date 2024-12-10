package com.unternehmensplattform.backend.controllers;

import com.unternehmensplattform.backend.entities.DTOs.WorkingDaysDTO;
import com.unternehmensplattform.backend.entities.User;
import com.unternehmensplattform.backend.services.interfaces.WorkingDaysService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.time.LocalDate;
import java.util.List;

@RestController
@RequestMapping("working_days")
@RequiredArgsConstructor
public class WorkingDaysController {
    private final WorkingDaysService workingDaysService;

    @PostMapping("/create")
    @ResponseStatus(HttpStatus.CREATED)
    public ResponseEntity<String> createActivityReport(@RequestBody @Valid WorkingDaysDTO dto) {
        User loggedInUser = (User) SecurityContextHolder.getContext().getAuthentication().getPrincipal();
        try {
            workingDaysService.createActivityReport(dto, loggedInUser);
            return ResponseEntity.status(HttpStatus.CREATED).body("Activity report created successfully.");
        } catch (IllegalArgumentException e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(e.getMessage());
        }
    }

    @PostMapping("/edit")
    public ResponseEntity<String> editActivityReport(@RequestBody @Valid WorkingDaysDTO dto) {
        User loggedInUser = (User) SecurityContextHolder.getContext().getAuthentication().getPrincipal();
        try {
            workingDaysService.editDescription(dto, loggedInUser);
            return ResponseEntity.ok("Activity report updated successfully.");
        } catch (IllegalArgumentException e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(e.getMessage());
        }
    }

    @GetMapping("/all")
    public ResponseEntity<List<WorkingDaysDTO>> getAllActivityReports() {
        User loggedInUser = (User) SecurityContextHolder.getContext().getAuthentication().getPrincipal();
        List<WorkingDaysDTO> activityReports = workingDaysService.getAllActivityReports(loggedInUser);
        return ResponseEntity.ok(activityReports);
    }


    @GetMapping("/today")
    public ResponseEntity<WorkingDaysDTO> getTodayActivityReport() {
        User loggedInUser = (User) SecurityContextHolder.getContext().getAuthentication().getPrincipal();
        WorkingDaysDTO activityReport = workingDaysService.getActivityReportByDate(loggedInUser, LocalDate.now());
        return ResponseEntity.ok(activityReport);
    }



    @PostMapping("/delete/{requestId}")
    public ResponseEntity<?> deleteVacationRequest(@PathVariable Integer requestId) {
        workingDaysService.deleteWorkingDay(requestId);
        return ResponseEntity.accepted().build();
    }
}

