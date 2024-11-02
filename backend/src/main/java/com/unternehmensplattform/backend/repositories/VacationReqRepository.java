package com.unternehmensplattform.backend.repositories;

import com.unternehmensplattform.backend.entities.VacationRequest;
import org.springframework.data.jpa.repository.JpaRepository;

public interface VacationReqRepository extends JpaRepository<VacationRequest, Integer> {

}
