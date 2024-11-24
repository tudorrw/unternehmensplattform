package com.unternehmensplattform.backend.services.interfaces;

import com.unternehmensplattform.backend.entities.DTOs.UserDetailsDTO;
import com.unternehmensplattform.backend.entities.DTOs.VacationRequestDTO;
import com.unternehmensplattform.backend.entities.DTOs.VacationRequestDetailsDTO;
import com.unternehmensplattform.backend.entities.User;
import com.unternehmensplattform.backend.entities.VacationRequest;

import java.util.List;

public interface VacationReqService {

    List<VacationRequestDetailsDTO> getVacationRequestsByEmployee();

    void deleteVacationRequest(Integer requestId);

    void createVacationRequest(VacationRequestDTO vacationRequestDTO, User employee);

    List<UserDetailsDTO> getAvailableAdministrators(User loggedInUser);
}