package com.unternehmensplattform.backend.services.implementations;

import com.unternehmensplattform.backend.entities.Contract;
import com.unternehmensplattform.backend.entities.User;
import com.unternehmensplattform.backend.entities.VacationRequest;
import com.unternehmensplattform.backend.entities.WorkingDay;
import com.unternehmensplattform.backend.enums.UserRole;
import com.unternehmensplattform.backend.handler.VacationRequestNotFoundException;
import com.unternehmensplattform.backend.entities.DTOs.WorkingDaysDTO;
import com.unternehmensplattform.backend.entities.User;
import com.unternehmensplattform.backend.entities.WorkingDay;
import com.unternehmensplattform.backend.repositories.ContractRepository;
import com.unternehmensplattform.backend.repositories.VacationReqRepository;
import com.unternehmensplattform.backend.repositories.WorkingDaysRepository;
import com.unternehmensplattform.backend.services.interfaces.WorkingDaysService;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;

import java.util.Objects;

import java.time.Instant;
import java.time.LocalDate;
import java.time.LocalTime;
import java.time.ZoneId;
import java.util.List;
import java.util.stream.Collectors;


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
    private final ContractRepository contractRepository;
    private final VacationReqRepository vacationRequestRepository;

    @Override
    public void createActivityReport(WorkingDaysDTO dto, User loggedInUser) {

        validateCreateConditions(dto, loggedInUser);

        validateStartAndEndDateConsistency(dto);

        WorkingDay newWorkingDay = WorkingDay.builder()
                .employee(loggedInUser)
                .date(LocalDate.now())
                .startDate(dto.getStartDate())
                .endDate(dto.getEndDate())
                .description(dto.getDescription())
                .build();

        workingDaysRepository.save(newWorkingDay);
    }

    @Override
    public void editDescription(WorkingDaysDTO dto, User loggedInUser) {
        WorkingDay workingDay = workingDaysRepository.findWorkingDayByEmployeeAndDate(loggedInUser, LocalDate.now())
                .orElseThrow(() -> new IllegalArgumentException("No activity report for today found to edit."));

        System.out.println(workingDay.getDate());

        validateEditConditions(dto, loggedInUser);

        validateStartAndEndDateConsistency(dto);


        workingDay.setStartDate(dto.getStartDate());
        workingDay.setEndDate(dto.getEndDate());
        workingDay.setDescription(dto.getDescription());
        workingDay.setDate(LocalDate.now());
        workingDaysRepository.save(workingDay);
    }

    @Override
    public List<WorkingDaysDTO> getAllActivityReports(User loggednInUser) {
        return workingDaysRepository.findAllByEmployee(loggednInUser)
                .stream()
                .map(this::convertToDto)
                .collect(Collectors.toList());
    }

    @Override
    public WorkingDaysDTO getActivityReportByDate(User loggedInUser, LocalDate date) {
        WorkingDay workingDay = workingDaysRepository.findWorkingDayByEmployeeAndDate(loggedInUser, date)
                .orElseThrow(() -> new IllegalArgumentException("No activity report found for the specified date."));
        return convertToDto(workingDay);
    }

    private void validateCreateConditions(WorkingDaysDTO dto, User loggedInUser) {
        if (dto.getStartDate().isAfter(dto.getEndDate())) {
            throw new IllegalArgumentException("Start date must be before end date.");
        }

        if (workingDaysRepository.findWorkingDayByEmployeeAndDate(loggedInUser, LocalDate.now()).isPresent()) {
            throw new IllegalArgumentException("An activity report already exists for the given date.");
        }

        hasVacationToday(loggedInUser);
        validateContractExists(loggedInUser);
    }

    private void validateEditConditions(WorkingDaysDTO dto, User loggedInUser) {
        if (dto.getStartDate().isAfter(dto.getEndDate())) {
            throw new IllegalArgumentException("Start date must be before end date.");
        }

//        if (!dto.getDate().equals(LocalDate.now())) {
//            throw new IllegalArgumentException("You can only edit today's activity report.");
//        }

        hasVacationToday(loggedInUser);
        validateContractExists(loggedInUser);
    }


    private void hasVacationToday(User loggedInUser) {
        LocalDate today = LocalDate.now();
        if (vacationRequestRepository.findByEmployeeIdOrderByRequestedDateDesc(loggedInUser.getId()).stream()
                .anyMatch(vacationReq -> !today.isBefore(vacationReq.getStartDate()) && !today.isAfter(vacationReq.getEndDate())))
            throw new IllegalArgumentException("A vacation request overlaps with today's date");
    }

    private void validateContractExists(User loggedInUser) {
        if (!contractRepository.findByUser(loggedInUser).isPresent()) {
            throw new IllegalArgumentException("No contract found for the user.");
        }
    }

    private WorkingDaysDTO convertToDto(WorkingDay workingDay) {
        return WorkingDaysDTO.builder()
                .date(LocalDate.now())
                .startDate(workingDay.getStartDate())
                .endDate(workingDay.getEndDate())
                .description(workingDay.getDescription())
                .build();
    }

    private void validateStartAndEndDateConsistency(WorkingDaysDTO dto) {
        Instant startDateInstant = dto.getStartDate();
        Instant endDateInstant = dto.getEndDate();
        LocalDate date = LocalDate.now();

        LocalDate startDate = startDateInstant.atZone(ZoneId.systemDefault()).toLocalDate();
        LocalDate endDate = endDateInstant.atZone(ZoneId.systemDefault()).toLocalDate();

        if (!startDate.equals(date)) {
            throw new IllegalArgumentException("Start date must be on the same day as the provided date.");
        }
        if (!endDate.equals(date)) {
            throw new IllegalArgumentException("End date must be on the same day as the provided date.");
        }
    }


}
