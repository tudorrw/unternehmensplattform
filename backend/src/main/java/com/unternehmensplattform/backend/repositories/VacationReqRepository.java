package com.unternehmensplattform.backend.repositories;

import java.util.List;
import com.unternehmensplattform.backend.entities.VacationRequest;
import org.springframework.data.jpa.repository.JpaRepository;

public interface VacationReqRepository extends JpaRepository<VacationRequest, Integer> {
    List<VacationRequest> findByAdministratorId(Integer administratorId);
}
