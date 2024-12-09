package com.unternehmensplattform.backend.services.implementations;

import com.unternehmensplattform.backend.entities.Contract;
import com.unternehmensplattform.backend.entities.User;
import com.unternehmensplattform.backend.entities.VacationRequest;
import com.unternehmensplattform.backend.entities.WorkingDay;
import com.unternehmensplattform.backend.enums.UserRole;
import com.unternehmensplattform.backend.handler.VacationRequestNotFoundException;
import com.unternehmensplattform.backend.repositories.WorkingDaysRepository;
import com.unternehmensplattform.backend.services.interfaces.WorkingDaysService;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;

import java.util.Objects;

@Service
@RequiredArgsConstructor
public class WorkingDaysServiceImpl implements WorkingDaysService {
    private final WorkingDaysRepository workingDaysRepository;

    @Override
    public void deleteWorkingDay(Integer requestId) {
        WorkingDay workingDay = workingDaysRepository .findById(requestId).orElse(null);
        if (workingDay == null) {
            throw new VacationRequestNotFoundException("Working day with id " + requestId + " not found.");
        }
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        User currentUser = (User) authentication.getPrincipal();
        if (currentUser.getRole() == UserRole.Employee || currentUser.getRole()==UserRole.Administrator) {
            Contract contract = currentUser.getContract();
            if (contract != null) {
                if (Objects.equals(workingDay.getEmployee().getId(), currentUser.getId())) {
//
                    workingDaysRepository.deleteById(requestId);
                } else {
                    throw new IllegalArgumentException("working day does not belong to the employee who made the request");
                }
            } else {
                throw new RuntimeException("Employee has no contract");
            }
        } else {
            throw new RuntimeException("User is not an employee or an admin");
        }
    }
}
