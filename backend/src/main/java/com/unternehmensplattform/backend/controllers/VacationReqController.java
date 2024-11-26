package com.unternehmensplattform.backend.controllers;


import com.unternehmensplattform.backend.entities.DTOs.UserDetailsDTO;
import com.unternehmensplattform.backend.entities.DTOs.VacationRequestDTO;
import com.unternehmensplattform.backend.entities.DTOs.VacationRequestDetailsDTO;
import com.unternehmensplattform.backend.entities.User;
import com.unternehmensplattform.backend.entities.VacationRequest;
import com.unternehmensplattform.backend.handler.InvalidVacationRequestException;
import com.unternehmensplattform.backend.handler.ResourceNotFoundException;
import com.unternehmensplattform.backend.handler.VacationRequestOverlapException;
import com.unternehmensplattform.backend.services.interfaces.VacationReqService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.core.io.FileSystemResource;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;
import lombok.extern.slf4j.Slf4j;


import java.io.File;
import java.util.List;

@Slf4j
@RestController
@RequestMapping("vacation-request")
@RequiredArgsConstructor
public class VacationReqController {
    private final VacationReqService vacationReqService;

    @GetMapping("/get-all-vacation-requests-for-employee")
    public ResponseEntity<List<VacationRequestDetailsDTO>> getVacationRequestsByEmployee() {
        List<VacationRequestDetailsDTO> requests = vacationReqService.getVacationRequestsByEmployee();
        return ResponseEntity.ok(requests);
    }


    @PostMapping("/delete/{requestId}")
    public ResponseEntity<?> deleteVacationRequest(@PathVariable Integer requestId) {
        vacationReqService.deleteVacationRequest(requestId);
        return ResponseEntity.accepted().build();
    }
    @PostMapping("/create")
    @ResponseStatus(HttpStatus.CREATED)
    public ResponseEntity<?> createVacationRequest(@RequestBody @Valid VacationRequestDTO vacationRequestDTO) {
        User loggedInUser = (User) SecurityContextHolder.getContext().getAuthentication().getPrincipal();
        vacationReqService.createVacationRequest(vacationRequestDTO, loggedInUser);
        return ResponseEntity.accepted().build();
    }

    @GetMapping("/download-pdf/{requestId}")
    public ResponseEntity<FileSystemResource> downloadVacationRequestPdf(@PathVariable Integer requestId) {
        VacationRequest vacationRequest = vacationReqService.getVacationRequestById(requestId);
        if (vacationRequest == null) {
            throw new IllegalArgumentException("Vacantion Request with this id does not exist");
        }
        File pdfFile = new File(vacationRequest.getPdfPath());
        if (!pdfFile.exists()) {
            throw new ResourceNotFoundException("PDF file not found for this request.");
        }

        FileSystemResource resource = new FileSystemResource(pdfFile);
        return ResponseEntity.ok()
                .header(HttpHeaders.CONTENT_DISPOSITION, "attachment; filename=" + pdfFile.getName())
                .contentType(MediaType.APPLICATION_PDF)
                .contentLength(pdfFile.length())
                .body(resource);
    }


    @GetMapping("/available-administrators")
    public ResponseEntity<List<UserDetailsDTO>> getAvailableAdministrators() {
        User loggedInUser = (User) SecurityContextHolder.getContext().getAuthentication().getPrincipal();
        List<UserDetailsDTO> availableAdmins = vacationReqService.getAvailableAdministrators(loggedInUser);
        return ResponseEntity.ok(availableAdmins);
    }
}
