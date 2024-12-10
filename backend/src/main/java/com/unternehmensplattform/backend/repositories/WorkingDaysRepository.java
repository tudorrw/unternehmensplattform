package com.unternehmensplattform.backend.repositories;

import com.unternehmensplattform.backend.entities.User;
import com.unternehmensplattform.backend.entities.WorkingDay;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import java.time.LocalDate;
import java.util.Collection;
import java.util.List;
import java.util.Optional;

public interface WorkingDaysRepository extends JpaRepository<WorkingDay, Integer> {
    Optional<WorkingDay> findWorkingDayByEmployeeAndDate(User loggedInUser, LocalDate date);

    List<WorkingDay> findAllByEmployee(User employee);


}
