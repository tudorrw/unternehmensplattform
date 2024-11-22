package com.unternehmensplattform.backend.services.implementations;

import com.unternehmensplattform.backend.entities.Contract;
import com.unternehmensplattform.backend.entities.DTOs.VacationRequestDTO;
import com.unternehmensplattform.backend.entities.User;
import com.unternehmensplattform.backend.entities.VacationRequest;
import com.unternehmensplattform.backend.enums.UserRole;
import com.unternehmensplattform.backend.enums.VacationReqStatus;
import com.unternehmensplattform.backend.handler.InvalidVacationRequestException;
import com.unternehmensplattform.backend.handler.VacationRequestOverlapException;
import com.unternehmensplattform.backend.repositories.ContractRepository;
import com.unternehmensplattform.backend.repositories.UserRepository;
import com.unternehmensplattform.backend.repositories.VacationReqRepository;
import com.unternehmensplattform.backend.services.interfaces.VacationReqService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.time.DayOfWeek;
import java.time.Instant;
import java.time.LocalDate;
import java.time.temporal.ChronoUnit;
import java.util.Comparator;
import java.util.List;
import java.util.stream.Stream;

@RequiredArgsConstructor
@Service
public class VacationRequestServiceImpl implements VacationReqService {

    private final VacationReqRepository vacationRequestRepository;
    private final ContractRepository contractRepository;
    private final UserRepository userRepository;

    public void createVacationRequest(VacationRequestDTO vacationRequestDTO, User employee) {
        Contract contract = contractRepository.findByUser(employee)
                .orElseThrow(() -> new InvalidVacationRequestException(
                        String.format("No contract found for user: %s", employee.getUsername())
                ));

        validateDates(vacationRequestDTO.getStartDate(), vacationRequestDTO.getEndDate(), employee);
        ensureNoOverlappingRequests(vacationRequestDTO.getStartDate(), vacationRequestDTO.getEndDate(), employee);

        long requestedWeekdays = calculateWeekdays(vacationRequestDTO.getStartDate(), vacationRequestDTO.getEndDate());

        if (requestedWeekdays > contract.getActualYearVacationDays()) {
            throw new InvalidVacationRequestException(
                    String.format("Requested days (%d) exceed available vacation days (%d) for the current year.",
                            requestedWeekdays, contract.getActualYearVacationDays())
            );
        }


        deductVacationDays(contract, (int) requestedWeekdays);
        saveVacationRequest(vacationRequestDTO, employee);
    }

    private void deductVacationDays(Contract contract, int requestedDays) {
        if (requestedDays > contract.getActualYearVacationDays()) {
            throw new InvalidVacationRequestException(
                    String.format("Not enough vacation days in the current year. You have %d days available.",
                            contract.getActualYearVacationDays())
            );
        }

        contract.setActualYearVacationDays(contract.getActualYearVacationDays() - requestedDays);
        contractRepository.save(contract);
    }

    private void saveVacationRequest(VacationRequestDTO vacationRequestDTO, User employee) {
        User assignedAdmin = getAssignedAdministrator(employee);

        VacationRequest vacationRequest = VacationRequest.builder()
                .employee(employee)
                .startDate(vacationRequestDTO.getStartDate())
                .endDate(vacationRequestDTO.getEndDate())
                .description(vacationRequestDTO.getDescription())
                .requestedDate(Instant.now())
                .status(VacationReqStatus.New)
                .administrator(assignedAdmin)
                .build();

        vacationRequestRepository.save(vacationRequest);
    }

    private User getAssignedAdministrator(User employee) {
        List<User> admins = userRepository.findUsersByCompany(UserRole.Administrator, employee.getContract().getCompany());
        if (admins.isEmpty()) {
            throw new InvalidVacationRequestException(String.format("No administrators available in the same company as the employee: %s", employee.getFirstName()));
        }

        return admins.stream()
                .min(Comparator.comparingInt(this::countPendingRequests))
                .orElseThrow(() -> new InvalidVacationRequestException("No administrators available"));
    }

    private int countPendingRequests(User admin) {
        return vacationRequestRepository.countByAdministratorAndStatus(admin, VacationReqStatus.New);
    }


    private long calculateWeekdays(LocalDate startDate, LocalDate endDate) {
        return Stream.iterate(startDate, date -> date.plusDays(1))
                .limit(ChronoUnit.DAYS.between(startDate, endDate) + 1)
                .filter(date -> {
                    DayOfWeek day = date.getDayOfWeek();
                    return day != DayOfWeek.SATURDAY && day != DayOfWeek.SUNDAY;
                })
                .count();
    }

    private void validateDates(LocalDate startDate, LocalDate endDate, User employee) {
        if (startDate.isAfter(endDate)) {
            throw new InvalidVacationRequestException("Start date must be before or equal to the end date.");
        }

        if (startDate.isBefore(employee.getContract().getSigningDate())) {
            throw new InvalidVacationRequestException("Start date cannot be in the past.");
        }
    }

    private void ensureNoOverlappingRequests(LocalDate startDate, LocalDate endDate, User employee) {
        boolean hasOverlaps = vacationRequestRepository.findByEmployee(employee).stream()
                .anyMatch(request -> request.getStatus() != VacationReqStatus.Rejected &&
                        !(endDate.isBefore(request.getStartDate()) || startDate.isAfter(request.getEndDate())));

        if (hasOverlaps) {
            throw new VacationRequestOverlapException("The requested dates overlap with an existing vacation request.");
        }
    }
}
