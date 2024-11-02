package com.unternehmensplattform.backend.controllers;

import com.unternehmensplattform.backend.services.interfaces.AuthenticationService;
import com.unternehmensplattform.backend.services.interfaces.WorkingDaysService;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("working_days")
@RequiredArgsConstructor
public class WorkingDaysController {
    private final AuthenticationService authenticationService;
    private final UserDetailsService userDetailsService;
    private final WorkingDaysService workingDaysService;
}
