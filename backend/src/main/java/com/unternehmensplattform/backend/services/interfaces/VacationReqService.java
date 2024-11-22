package com.unternehmensplattform.backend.services.interfaces;

import com.unternehmensplattform.backend.entities.DTOs.VacationRequestDTO;
import com.unternehmensplattform.backend.entities.User;

public interface VacationReqService {

    public void createVacationRequest(VacationRequestDTO vacationRequestDTO, User employee);
}