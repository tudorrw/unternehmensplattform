package com.unternehmensplattform.backend.repositories;

import com.unternehmensplattform.backend.entities.VacationRequest;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface VacationReqRepository extends JpaRepository<VacationRequest, Integer> {
    List<VacationRequest> findByEmployeeIdOrderByRequestedDateDesc(Integer employeeId);

    void deleteById(Integer id);


}
