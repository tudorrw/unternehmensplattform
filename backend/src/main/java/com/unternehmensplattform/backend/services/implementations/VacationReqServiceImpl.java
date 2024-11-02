package com.unternehmensplattform.backend.services.implementations;

import com.unternehmensplattform.backend.repositories.VacationReqRepository;
import com.unternehmensplattform.backend.services.interfaces.VacationReqService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class VacationReqServiceImpl implements VacationReqService {
    private final VacationReqRepository vacationReqRepository;
}
