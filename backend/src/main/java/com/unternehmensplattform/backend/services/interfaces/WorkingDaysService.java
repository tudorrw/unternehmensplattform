package com.unternehmensplattform.backend.services.interfaces;

import com.unternehmensplattform.backend.entities.DTOs.WorkingDaysDTO;
import com.unternehmensplattform.backend.entities.User;

public interface WorkingDaysService {

    void stopWorkingDay(WorkingDaysDTO dto, User loggedInUser);

    void startWorkingDay(WorkingDaysDTO dto, User loggedInUser);

    void finalizeWorkingDay(WorkingDaysDTO dto, User loggedInUser);
}