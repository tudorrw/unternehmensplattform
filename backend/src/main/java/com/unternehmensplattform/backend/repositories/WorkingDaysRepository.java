package com.unternehmensplattform.backend.repositories;

import com.unternehmensplattform.backend.entities.User;
import com.unternehmensplattform.backend.entities.WorkingDay;
import org.springframework.data.jpa.repository.JpaRepository;

import java.time.LocalDate;
import java.util.Optional;

public interface WorkingDaysRepository extends JpaRepository<WorkingDay, Integer> {
    Optional<WorkingDay> findWorkingDayByEmployeeAndDate(User loggedInUser, LocalDate date);

    Optional<WorkingDay> findWorkingDaysWithoutDescription();
}
