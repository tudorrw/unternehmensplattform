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
        request.setStatus(status);
        vacationReqRepository.save(request);

        if (status == VacationReqStatus.Rejected) {
            int vacationDays = vacationReqHandler.calculateLeaveDays(request.getStartDate(), request.getEndDate());
            Contract employeeContract = request.getEmployee().getContract();
            employeeContract.setActualYearVacationDays(employeeContract.getActualYearVacationDays() + vacationDays);
            contractRepository.save(employeeContract);
        }


    }

}
