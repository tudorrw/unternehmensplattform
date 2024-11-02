package com.unternehmensplattform.backend.repositories;

import com.unternehmensplattform.backend.entities.WorkingDay;
import org.springframework.data.jpa.repository.JpaRepository;

public interface WorkingDaysRepository extends JpaRepository<WorkingDay, Integer> {
}
