package com.unternehmensplattform.backend.repositories;

import com.unternehmensplattform.backend.entities.Contract;
import com.unternehmensplattform.backend.entities.User;
import org.springframework.data.jpa.repository.JpaRepository;

public interface ContractRepository extends JpaRepository<Contract, Integer> {
    Contract findByUser(User employee);
}
