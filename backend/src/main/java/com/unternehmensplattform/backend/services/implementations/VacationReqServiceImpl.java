package com.unternehmensplattform.backend.services.implementations;

import com.unternehmensplattform.backend.entities.Contract;
import com.unternehmensplattform.backend.entities.User;
import com.unternehmensplattform.backend.entities.VacationRequest;
import com.unternehmensplattform.backend.enums.VacationReqStatus;
import com.unternehmensplattform.backend.handler.VacationReqHandler;
import com.unternehmensplattform.backend.repositories.ContractRepository;
import com.unternehmensplattform.backend.repositories.VacationReqRepository;
import com.unternehmensplattform.backend.services.interfaces.VacationReqService;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;


@Service
@RequiredArgsConstructor
public class VacationReqServiceImpl implements VacationReqService {
    private final VacationReqRepository vacationReqRepository;
    private final VacationReqHandler vacationReqHandler;
    private final ContractRepository contractRepository;

    @Override
    public void updateRequestStatus(Integer requestId, VacationReqStatus status) {
        VacationRequest request = vacationReqRepository.findById(requestId)
                .orElseThrow(() -> new RuntimeException("Vacation request not found"));

        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        User currentAdmin = (User) authentication.getPrincipal();

        if (!request.getAdministrator().equals(currentAdmin)) {
            throw new RuntimeException("You are not authorized to modify this request");
        }

        if (status == VacationReqStatus.Approved) {
            int vacationDays = vacationReqHandler.calculateLeaveDays(request.getStartDate(), request.getEndDate());

            if (!hasSufficientVacationDays(request.getEmployee(), vacationDays)) {
                request.setStatus(VacationReqStatus.Rejected);
                vacationReqRepository.save(request);
                throw new RuntimeException("The employee does not have enough vacation days. The request has been rejected.");
            }

            request.setStatus(VacationReqStatus.Approved);
            vacationReqRepository.save(request);
            updateEmployeeVacationDays(request.getEmployee(), vacationDays);

        } else {
            request.setStatus(status);
            vacationReqRepository.save(request);
        }
    }

    private boolean hasSufficientVacationDays(User employee, int usedDays) {
        Contract contract = contractRepository.findByUser(employee);
        if (contract == null) {
            throw new RuntimeException("No contract found for the employee");
        }
        return contract.getActualYearVacationDays() >= usedDays;
    }

    private void updateEmployeeVacationDays(User employee, int usedDays) {
        Contract contract = contractRepository.findByUser(employee);
        if (contract == null) {
            throw new RuntimeException("No contract found for the employee");
        }
        contract.setActualYearVacationDays(contract.getActualYearVacationDays() - usedDays);
        contractRepository.save(contract);

    }
}
