package com.unternehmensplattform.backend.services.interfaces;

import com.unternehmensplattform.backend.entities.DTOs.UserWithVacationRequestDetailsDTO;
import com.unternehmensplattform.backend.entities.DTOs.VacationRequestDetailsDTO;
import com.unternehmensplattform.backend.entities.VacationRequest;

import java.util.List;

public interface VacationReqService {
    List<VacationRequestDetailsDTO> getAllPendingVacationRequests();

    List<UserWithVacationRequestDetailsDTO> getAllEmployeesWithVacationRequests();
}
