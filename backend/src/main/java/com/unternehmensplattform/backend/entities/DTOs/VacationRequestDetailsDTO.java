package com.unternehmensplattform.backend.entities.DTOs;

import com.unternehmensplattform.backend.enums.VacationReqStatus;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.Instant;
import java.time.LocalDate;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class VacationRequestDetailsDTO {
    private Integer id;
    private Instant requestedDate;
    private LocalDate startDate;
    private LocalDate endDate;
    private VacationReqStatus status;
    private String description;


    private String adminEmail;
}
