package com.unternehmensplattform.backend.repositories;

import com.unternehmensplattform.backend.entities.User;
import com.unternehmensplattform.backend.entities.VacationRequest;
import com.unternehmensplattform.backend.enums.VacationReqStatus;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface VacationReqRepository extends JpaRepository<VacationRequest, Integer> {
    List<VacationRequest> findByEmployeeIdOrderByRequestedDateDesc(Integer employeeId);

    void deleteById(Integer id);

    List<VacationRequest> findByEmployee(User employee);

    int countByAdministratorAndStatus(User administrator, VacationReqStatus status);
}
