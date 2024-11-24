package com.unternehmensplattform.backend.services.implementations;

import com.unternehmensplattform.backend.entities.VacationRequest;
import com.unternehmensplattform.backend.repositories.VacationReqRepository;
import com.unternehmensplattform.backend.services.interfaces.VacationReqService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;


@Service
@RequiredArgsConstructor
public class VacationReqServiceImpl implements VacationReqService {
    private final VacationReqRepository vacationReqRepository;

    public List<VacationRequest> getRequestsByAdmin(Integer administratorId) {
        return vacationReqRepository.findByAdministratorId(administratorId);
    }
}
