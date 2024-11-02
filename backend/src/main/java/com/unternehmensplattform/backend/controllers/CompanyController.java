package com.unternehmensplattform.backend.controllers;


import com.unternehmensplattform.backend.services.interfaces.AuthenticationService;
import com.unternehmensplattform.backend.services.interfaces.CompanyService;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("company")
@RequiredArgsConstructor
public class CompanyController {
    private final AuthenticationService authenticationService;
    private final UserDetailsService userDetailsService;
    private final CompanyService companyService;

//    @PostMapping("/create")
//    @ResponseStatus(HttpStatus.ACCEPTED)
//    public ResponseEntity<?> register(
//            @RequestBody @Valid CompanyDTO) {
//        return ResponseEntity.accepted().build();
//    }
}
