package com.unternehmensplattform.backend.services.implementations;

import com.unternehmensplattform.backend.entities.VacationRequest;
import com.unternehmensplattform.backend.handler.VacationRequestNotFoundException;
import com.unternehmensplattform.backend.repositories.VacationReqRepository;
import com.unternehmensplattform.backend.services.interfaces.VacationReqService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class VacationReqServiceImpl implements VacationReqService {
    private final VacationReqRepository vacationReqRepository;

    public List<VacationRequest> getVacationRequestsByEmployee(Integer employeeId) {
        List<VacationRequest> vacationRequests = vacationReqRepository.findByEmployeeIdOrderByRequestedDateDesc(employeeId);
        if (vacationRequests.isEmpty()) {
            throw new VacationRequestNotFoundException("No vacation requests found for the specified employee.");
        }
        return vacationRequests;
    }


    public void deleteVacationRequest(Integer requestId) {
        if (!vacationReqRepository.existsById(requestId)) {
            throw new VacationRequestNotFoundException("No vacation request found.");
        }
        vacationReqRepository.deleteById(requestId);
    }
}
