package com.unternehmensplattform.backend.services.interfaces;

import com.unternehmensplattform.backend.entities.DTOs.VacationRequestDTO;
import com.unternehmensplattform.backend.entities.User;

import com.unternehmensplattform.backend.entities.VacationRequest;

import java.util.List;

public interface VacationReqService {

    public List<VacationRequest> getVacationRequestsByEmployee(Integer employeeId);

    public void deleteVacationRequest(Integer requestId);

    public void createVacationRequest(VacationRequestDTO vacationRequestDTO, User employee);
}