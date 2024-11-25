package com.unternehmensplattform.backend.services.implementations;

import com.unternehmensplattform.backend.entities.DTOs.UserDetailsDTO;
import com.unternehmensplattform.backend.entities.DTOs.UserWithVacationRequestDetailsDTO;
import com.unternehmensplattform.backend.entities.DTOs.VacationRequestDetailsDTO;
import com.unternehmensplattform.backend.entities.User;
import com.unternehmensplattform.backend.entities.VacationRequest;
import com.unternehmensplattform.backend.enums.UserRole;
import com.unternehmensplattform.backend.enums.VacationReqStatus;
import com.unternehmensplattform.backend.repositories.UserRepository;
import com.unternehmensplattform.backend.entities.Contract;
import com.unternehmensplattform.backend.handler.VacationReqHandler;
import com.unternehmensplattform.backend.repositories.ContractRepository;
import com.unternehmensplattform.backend.repositories.VacationReqRepository;
import com.unternehmensplattform.backend.services.interfaces.VacationReqService;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;



@Service
@RequiredArgsConstructor
public class VacationReqServiceImpl implements VacationReqService {
    private final VacationReqRepository vacationReqRepository;
    private final VacationReqHandler vacationReqHandler;
    private final ContractRepository contractRepository;
    private final UserRepository userRepository;

    @Override
    public void updateRequestStatus(Integer requestId, VacationReqStatus status) {
        VacationRequest request = vacationReqRepository.findById(requestId)
                .orElseThrow(() -> new RuntimeException("Vacation request not found"));

        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        User currentAdmin = (User) authentication.getPrincipal();

        if (request.getAdministrator().getId() != currentAdmin.getId()) {
            throw new RuntimeException("You are not authorized to modify this request");
        }
        request.setStatus(status);
        vacationReqRepository.save(request);

        if (status == VacationReqStatus.Rejected) {
            int vacationDays = vacationReqHandler.calculateLeaveDays(request.getStartDate(), request.getEndDate());
            Contract employeeContract = request.getEmployee().getContract();
            employeeContract.setActualYearVacationDays(employeeContract.getActualYearVacationDays() + vacationDays);
            contractRepository.save(employeeContract);
        }
    }


    public List<VacationRequest> getRequestsByAdmin(Integer administratorId) {
        return vacationReqRepository.findByAdministratorId(administratorId);
    }

    @Override
    public List<VacationRequestDetailsDTO> getAllPendingVacationRequests() {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        User currentUser = (User) authentication.getPrincipal();

        if (currentUser.getRole() == UserRole.Administrator) {
            if (currentUser.getContract() != null) {
                List<VacationRequest> vacationRequests = vacationReqRepository.findByAdministratorIdAndStatus(currentUser.getId(), VacationReqStatus.New);
                return vacationRequests.stream()
                        .map(vacationRequest -> VacationRequestDetailsDTO.builder()
                                .id(vacationRequest.getId())
                                .employeeEmail(vacationRequest.getEmployee().getEmail())
                                .employeeId(vacationRequest.getEmployee().getId())
                                .requestedDate(vacationRequest.getRequestedDate())
                                .startDate(vacationRequest.getStartDate())
                                .endDate(vacationRequest.getEndDate())
                                .description(vacationRequest.getDescription())
                                .status(vacationRequest.getStatus())
                                .vacationDays(vacationReqHandler.calculateLeaveDays(vacationRequest.getStartDate(), vacationRequest.getEndDate()))
                                .build())
                        .collect(Collectors.toList());
            } else {
                throw new RuntimeException("Admin has no contract");
            }
        } else {
            throw new RuntimeException("User is not an administrator");
        }
    }

    @Override
    public List<UserWithVacationRequestDetailsDTO> getAllEmployeesWithVacationRequests() {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        User currentUser = (User) authentication.getPrincipal();

        if (currentUser.getRole() != UserRole.Administrator) {
            throw new RuntimeException("User is not an administrator");
        }

        if (currentUser.getContract() == null) {
            throw new RuntimeException("Admin has no contract");
        }

        List<VacationRequest> vacationRequests = vacationReqRepository
                .findByAdministratorIdAndStatusInOrderByStartDateDesc(
                        currentUser.getId(),
                        VacationReqStatus.Approved,
                        VacationReqStatus.Rejected
                );

        Map<User, List<VacationRequest>> groupedRequests = vacationRequests.stream()
                .collect(Collectors.groupingBy(VacationRequest::getEmployee));

        return groupedRequests.entrySet().stream()
                .map(entry -> {
                    User employee = entry.getKey();
                    List<VacationRequest> employeeRequests = entry.getValue();

                    return UserWithVacationRequestDetailsDTO.builder()
                            .userDetailsDTO(UserDetailsDTO.builder()
                                    .id(employee.getId())
                                    .firstName(employee.getFirstName())
                                    .lastName(employee.getLastName())
                                    .email(employee.getEmail())
                                    .telefonNumber(employee.getTelefonNumber())
                                    .accountLocked(employee.isAccountLocked())
                                    .role(employee.getRole())
                                    .companyName(employee.getContract() != null ? employee.getContract().getCompany().getName() : null)
                                    .actualYearVacationDays(employee.getContract() != null ? employee.getContract().getActualYearVacationDays() : null)
                                    .build())
                            .vacationRequests(employeeRequests.stream()
                                    .map(vacationRequest -> VacationRequestDetailsDTO.builder()
                                            .id(vacationRequest.getId())
                                            .requestedDate(vacationRequest.getRequestedDate())
                                            .startDate(vacationRequest.getStartDate())
                                            .endDate(vacationRequest.getEndDate())
                                            .description(vacationRequest.getDescription())
                                            .status(vacationRequest.getStatus())
                                            .vacationDays(vacationReqHandler.calculateLeaveDays(
                                                    vacationRequest.getStartDate(),
                                                    vacationRequest.getEndDate()
                                            ))
                                            .build())
                                    .collect(Collectors.toList()))
                            .build();
                })
                .collect(Collectors.toList());
    }
}
