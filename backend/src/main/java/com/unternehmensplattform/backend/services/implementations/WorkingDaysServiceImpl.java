package com.unternehmensplattform.backend.services.implementations;

import com.unternehmensplattform.backend.entities.Contract;
import com.unternehmensplattform.backend.entities.DTOs.WorkingDaysDTO;
import com.unternehmensplattform.backend.entities.User;
import com.unternehmensplattform.backend.entities.VacationRequest;
import com.unternehmensplattform.backend.entities.WorkingDay;
import com.unternehmensplattform.backend.repositories.ContractRepository;
import com.unternehmensplattform.backend.repositories.VacationReqRepository;
import com.unternehmensplattform.backend.repositories.WorkingDaysRepository;
import com.unternehmensplattform.backend.services.interfaces.WorkingDaysService;
import lombok.RequiredArgsConstructor;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Service;

import java.time.Instant;
import java.time.LocalDate;
import java.time.temporal.ChronoUnit;
import java.util.Optional;

@Service
@RequiredArgsConstructor
public class WorkingDaysServiceImpl implements WorkingDaysService {
    private final WorkingDaysRepository workingDaysRepository;
    private final ContractRepository contractRepository;
    private final VacationReqRepository vacationReqRepository;


    @Override
    public void startWorkingDay(WorkingDaysDTO dto, User loggedInUser) {
        Contract contract = contractRepository.findByUser(loggedInUser)
                .orElseThrow(() -> new IllegalArgumentException(
                        String.format("No contract found for user: %s", loggedInUser.getUsername())
                ));

        validateStartConditions(loggedInUser);

        Instant now = Instant.now();
        WorkingDay newWorkingDay = WorkingDay.builder()
                .employee(loggedInUser)
                .date(LocalDate.now())
                .startDate(now)
                .endDate(now.plus(8, ChronoUnit.HOURS))
                .description(null)
                .build();

        workingDaysRepository.save(newWorkingDay);
    }

    @Override
    public void finalizeWorkingDay(WorkingDaysDTO dto, User loggedInUser) {
        WorkingDay workingDay = workingDaysRepository.findWorkingDayByEmployeeAndDate(loggedInUser, LocalDate.now())
                .orElseThrow(() -> new IllegalArgumentException("No incomplete working day found to finalize."));

        if (dto.getDescription() == null || dto.getDescription().isBlank()) {
            throw new IllegalArgumentException("A description is required to finalize your working day.");
        }

        workingDay.setDescription(dto.getDescription());
        workingDaysRepository.save(workingDay);
    }


    @Override
    public void stopWorkingDay(WorkingDaysDTO dto, User loggedInUser) {
        WorkingDay workingDay = workingDaysRepository.findWorkingDayByEmployeeAndDate(loggedInUser, LocalDate.now())
                .orElseThrow(() -> new IllegalArgumentException("No active working day found to stop manually."));

        workingDay.setEndDate(Instant.now());
        workingDaysRepository.save(workingDay);

        // Description is added via the finalize endpoint
    }


    private void validateStartConditions(User loggedInUser) {
        if (hasVacationToday(loggedInUser)) {
            throw new IllegalArgumentException("You cannot clock in today because you have a vacation request overlapping with today's date.");
        }

        Optional<WorkingDay> existingWorkingDay = workingDaysRepository.findWorkingDayByEmployeeAndDate(loggedInUser, LocalDate.now());
        if (existingWorkingDay.isPresent() && existingWorkingDay.get().getDescription() == null) {
            throw new IllegalArgumentException("You cannot start a new working day without finalizing the previous one.");
        }
    }

    private boolean hasVacationToday(User loggedInUser) {
        LocalDate today = LocalDate.now();
        return vacationReqRepository.findByEmployee(loggedInUser).stream()
                .anyMatch(vacationReq -> !today.isBefore(vacationReq.getStartDate()) && !today.isAfter(vacationReq.getEndDate()));
    }

    // Runs every minute to check for auto clock-out
    @Scheduled(cron = "0 * * * * *")
    public void autoClockOut() {
        Instant now = Instant.now();

        Optional<WorkingDay> workingDayOptional = workingDaysRepository.findWorkingDaysWithoutDescription();
        if (workingDayOptional.isPresent()) {
            WorkingDay workingDay = workingDayOptional.get();

            if (now.isAfter(workingDay.getEndDate())) {
                workingDay.setEndDate(workingDay.getEndDate());
                workingDaysRepository.save(workingDay);
            }
        }
    }

}


