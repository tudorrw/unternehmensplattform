package com.unternehmensplattform.backend.services.implementations;

import com.unternehmensplattform.backend.entities.DTOs.UserDetailsDTO;
import com.unternehmensplattform.backend.entities.DTOs.VacationRequestDTO;
import com.unternehmensplattform.backend.entities.User;
import com.unternehmensplattform.backend.entities.VacationRequest;
import com.unternehmensplattform.backend.enums.UserRole;
import com.unternehmensplattform.backend.enums.VacationReqStatus;
import com.unternehmensplattform.backend.handler.InvalidVacationRequestException;
import com.unternehmensplattform.backend.handler.VacationRequestNotFoundException;
import com.unternehmensplattform.backend.handler.VacationRequestOverlapException;
import com.unternehmensplattform.backend.repositories.UserRepository;
import com.unternehmensplattform.backend.repositories.VacationReqRepository;
import com.unternehmensplattform.backend.services.interfaces.VacationReqService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;

import java.time.Instant;
import java.time.LocalDate;
import java.util.List;

@Slf4j
@RequiredArgsConstructor
@Service
public class VacationRequestServiceImpl implements VacationReqService {

    private final VacationReqRepository vacationRequestRepository;
    private final UserRepository userRepository;

    public void createVacationRequest(VacationRequestDTO vacationRequestDTO, User employee) {

        validateDates(vacationRequestDTO.getStartDate(), vacationRequestDTO.getEndDate(), employee);
        ensureNoOverlappingRequests(vacationRequestDTO.getStartDate(), vacationRequestDTO.getEndDate(), employee);

        User administrator = userRepository.findById(vacationRequestDTO.getAssignedAdministratorId())
                .orElseThrow(() -> new InvalidVacationRequestException("Admin not found"));


        VacationRequest vacationRequest = buildVacationRequest(vacationRequestDTO, employee, administrator);
        vacationRequestRepository.save(vacationRequest);

    }

    private void validateDates(LocalDate startDate, LocalDate endDate, User employee) {
        if (startDate.isAfter(endDate)) {
            throw new InvalidVacationRequestException("Start date must be before or equal to the end date.");
        }

        if (startDate.isBefore(employee.getContract().getSigningDate())) {
            throw new InvalidVacationRequestException("Start date cannot be in the past.");
        }
    }

    private void ensureNoOverlappingRequests(LocalDate startDate, LocalDate endDate, User employee) {
        boolean hasOverlaps = vacationRequestRepository.findByEmployee(employee).stream()
                .anyMatch(request -> request.getStatus() != VacationReqStatus.Rejected &&
                        !(endDate.isBefore(request.getStartDate()) || startDate.isAfter(request.getEndDate())));

        if (hasOverlaps) {
            throw new VacationRequestOverlapException("The requested dates overlap with an existing vacation request.");
        }
    }


    private VacationRequest buildVacationRequest(VacationRequestDTO dto, User employee, User administrator) {
        return VacationRequest.builder()
                .employee(employee)
                .administrator(administrator)
                .startDate(dto.getStartDate())
                .endDate(dto.getEndDate())
                .description(dto.getDescription())
                .requestedDate(Instant.now())
                .status(VacationReqStatus.New)
                .build();
    }

    @Override
    public List<UserDetailsDTO> getAvailableAdministrators(User employee) {
        return userRepository.findUsersByRoleAndCompany(UserRole.Administrator, employee.getContract().getCompany()).stream()
                .map(this::convertToUserDetailsDTO)
                .toList();
    }

    public UserDetailsDTO convertToUserDetailsDTO(User user) {
        UserDetailsDTO.UserDetailsDTOBuilder builder = UserDetailsDTO.builder()
                .id(user.getId())
                .firstName(user.getFirstName())
                .lastName(user.getLastName())
                .email(user.getEmail())
                .telefonNumber(user.getTelefonNumber())
                .accountLocked(user.isAccountLocked())
                .role(user.getRole());

        return builder.build();
    }

    public List<VacationRequest> getVacationRequestsByEmployee(Integer employeeId) {
        List<VacationRequest> vacationRequests = vacationRequestRepository.findByEmployeeIdOrderByRequestedDateDesc(employeeId);
        if (vacationRequests.isEmpty()) {
            throw new VacationRequestNotFoundException("No vacation requests found for the specified employee.");
        }
        return vacationRequests;
    }

    public void deleteVacationRequest(Integer requestId) {
        if (!vacationRequestRepository.existsById(requestId)) {
            throw new VacationRequestNotFoundException("No vacation request found.");
        }
        vacationRequestRepository.deleteById(requestId);
    }
}
