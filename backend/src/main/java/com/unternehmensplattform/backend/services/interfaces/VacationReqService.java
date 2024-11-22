package com.unternehmensplattform.backend.services.interfaces;

import com.unternehmensplattform.backend.entities.VacationRequest;

import java.util.List;

public interface VacationReqService {

    public List<VacationRequest> getVacationRequestsByEmployee(Integer employeeId);

    public void deleteVacationRequest(Integer requestId);
}
