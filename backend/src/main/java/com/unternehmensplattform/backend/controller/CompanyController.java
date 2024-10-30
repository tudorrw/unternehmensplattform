package com.unternehmensplattform.backend.controller;


import com.unternehmensplattform.backend.entities.DTOs.CompanyDTO;
import com.unternehmensplattform.backend.entities.DTOs.RegistrationRequest;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("company")
@RequiredArgsConstructor
public class CompanyController {
//    @PostMapping("/create")
//    @ResponseStatus(HttpStatus.ACCEPTED)
//    public ResponseEntity<?> register(
//            @RequestBody @Valid CompanyDTO) {
//        return ResponseEntity.accepted().build();
//    }
}
