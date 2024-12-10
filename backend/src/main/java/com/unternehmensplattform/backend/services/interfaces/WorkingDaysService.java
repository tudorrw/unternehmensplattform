package com.unternehmensplattform.backend.services.interfaces;

import com.unternehmensplattform.backend.entities.DTOs.WorkingDaysDTO;
import com.unternehmensplattform.backend.entities.User;

import java.time.LocalDate;
import java.util.List;

public interface WorkingDaysService {

    void createActivityReport(WorkingDaysDTO dto, User loggedInUser);

    void editDescription(WorkingDaysDTO dto, User loggedInUser);

    List<WorkingDaysDTO> getAllActivityReports(User user);

    WorkingDaysDTO getActivityReportByDate(User user, LocalDate date);
}