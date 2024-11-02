package com.unternehmensplattform.backend.controllers;


import com.unternehmensplattform.backend.services.interfaces.AuthenticationService;
import com.unternehmensplattform.backend.services.interfaces.VacationReqService;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("vacation_request")
@RequiredArgsConstructor
public class VacationReqController {
    private final AuthenticationService authenticationService;
    private final UserDetailsService userDetailsService;
    private final VacationReqService vacationReqService;
}
