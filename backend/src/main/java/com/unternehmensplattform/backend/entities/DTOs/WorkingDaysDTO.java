package com.unternehmensplattform.backend.entities.DTOs;

import jakarta.persistence.criteria.CriteriaBuilder;
import lombok.Builder;
import lombok.Data;

import java.time.Instant;
import java.time.LocalDate;

@Builder
@Data
public class WorkingDaysDTO {

    private LocalDate date;

    private Instant startDate;

    private Instant endDate;

    private String description;
}
