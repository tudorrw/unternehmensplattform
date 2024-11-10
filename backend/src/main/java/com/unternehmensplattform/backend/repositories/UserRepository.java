package com.unternehmensplattform.backend.repositories;

import com.unternehmensplattform.backend.entities.User;
import com.unternehmensplattform.backend.enums.UserRole;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface UserRepository extends JpaRepository<User, Integer> {
    Optional<User> findByEmail(String username);

    List<User> findByRole(UserRole userRole);
}
