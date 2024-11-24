package com.unternehmensplattform.backend.services.interfaces;

import com.unternehmensplattform.backend.enums.VacationReqStatus;


import com.unternehmensplattform.backend.entities.DTOs.UserWithVacationRequestDetailsDTO;
import com.unternehmensplattform.backend.entities.DTOs.VacationRequestDetailsDTO;
import com.unternehmensplattform.backend.entities.VacationRequest;

import java.util.List;

public interface VacationReqService {
    void updateRequestStatus(Integer requestId, VacationReqStatus status);
    List<VacationRequestDetailsDTO> getAllPendingVacationRequests();

    List<UserWithVacationRequestDetailsDTO> getAllEmployeesWithVacationRequests();
}
