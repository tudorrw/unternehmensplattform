package com.unternehmensplattform.backend.repositories;

import com.unternehmensplattform.backend.entities.Contract;
import org.springframework.data.jpa.repository.JpaRepository;

public interface ContractRepository extends JpaRepository<Contract, Integer> {
}
