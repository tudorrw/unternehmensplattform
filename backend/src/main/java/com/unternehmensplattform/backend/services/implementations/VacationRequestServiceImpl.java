package com.unternehmensplattform.backend.services.implementations;

import com.itextpdf.text.Document;
import com.itextpdf.text.DocumentException;
import com.itextpdf.text.Paragraph;
import com.itextpdf.text.pdf.PdfWriter;

import java.io.FileOutputStream;
import java.io.IOException;

import com.unternehmensplattform.backend.entities.*;
import com.unternehmensplattform.backend.entities.DTOs.*;
import com.unternehmensplattform.backend.enums.*;
import com.unternehmensplattform.backend.handler.*;
import com.unternehmensplattform.backend.repositories.*;
import com.unternehmensplattform.backend.services.interfaces.VacationReqService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;

import java.nio.file.Files;
import java.nio.file.Paths;
import java.time.DayOfWeek;
import java.time.Instant;
import java.time.LocalDate;
import java.time.temporal.ChronoUnit;
import java.util.List;
import java.util.stream.Collectors;
import java.util.stream.Stream;

@Slf4j
@RequiredArgsConstructor
@Service
public class VacationRequestServiceImpl implements VacationReqService {

    private final VacationReqRepository vacationRequestRepository;
    private final UserRepository userRepository;
    private final ContractRepository contractRepository;


    public void createVacationRequest(VacationRequestDTO vacationRequestDTO, User employee) {
        Contract contract = contractRepository.findByUser(employee)
                .orElseThrow(() -> new IllegalArgumentException(
                        String.format("No contract found for user: %s", employee.getUsername())
                ));

        validateDates(vacationRequestDTO.getStartDate(), vacationRequestDTO.getEndDate(), employee);
        ensureNoOverlappingRequests(vacationRequestDTO.getStartDate(), vacationRequestDTO.getEndDate(), employee);

        User administrator = userRepository.findById(vacationRequestDTO.getAssignedAdministratorId())
                .orElseThrow(() -> new IllegalArgumentException("Admin not found"));

        if(administrator.getContract().getCompany().getId() != contract.getCompany().getId()) {
            throw new IllegalArgumentException("Admin does not have the same company as the employee");
        }

        long requestedWeekdays = calculateWeekdays(vacationRequestDTO.getStartDate(), vacationRequestDTO.getEndDate());


        if (requestedWeekdays > employee.getContract().getActualYearVacationDays()) {
            throw new InvalidVacationRequestException(
                    String.format("Requested days (%d) exceed available vacation days (%d) for the current year.",
                            requestedWeekdays, employee.getContract().getActualYearVacationDays())
            );
        }

        // Build the vacation request
        VacationRequest vacationRequest = buildVacationRequest(vacationRequestDTO, employee, administrator);

        contract.setActualYearVacationDays(contract.getActualYearVacationDays() - (int)requestedWeekdays);
        contractRepository.save(contract);

        vacationRequest = vacationRequestRepository.save(vacationRequest);

        String pdfPath = generatePdf(vacationRequest);

        vacationRequest.setPdfPath(pdfPath);
        vacationRequestRepository.save(vacationRequest);




    }


    private void validateDates(LocalDate startDate, LocalDate endDate, User employee) {

        if (startDate.isAfter(endDate)) {
            throw new VacationRequestValidationDatesException("Start date must be before or equal to the end date.");
        }

        if (startDate.isBefore(employee.getContract().getSigningDate())) {
            throw new VacationRequestValidationDatesException("Start date cannot be in the past.");
        }

        if (startDate.isBefore(LocalDate.now())) {
            throw new VacationRequestValidationDatesException("Start date must be after today");
        }
    }

    private long calculateWeekdays(LocalDate startDate, LocalDate endDate) {
        return Stream.iterate(startDate, date -> date.plusDays(1))
                .limit(ChronoUnit.DAYS.between(startDate, endDate) + 1)
                .filter(date -> {
                    DayOfWeek day = date.getDayOfWeek();
                    return day != DayOfWeek.SATURDAY && day != DayOfWeek.SUNDAY;
                })
                .count();
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

    private String generatePdf(VacationRequest vacationRequest) {
        String directoryPath = "vacation_requests";
        String filePath = directoryPath + "/vacation_request_" + vacationRequest.getId() + ".pdf";

        // Ensure the directory exists
        try {
            Files.createDirectories(Paths.get(directoryPath));
        } catch (IOException e) {
            throw new RuntimeException("Error creating directory: " + directoryPath, e);
        }

        Document document = new Document();
        try {
            PdfWriter.getInstance(document, new FileOutputStream(filePath));
            document.open();

            document.add(new Paragraph("Vacation Request Details"));
            document.add(new Paragraph("Employee Name: " + vacationRequest.getEmployee().getFirstName() + " " + vacationRequest.getEmployee().getLastName()));
            document.add(new Paragraph("Administrator: " + vacationRequest.getAdministrator().getFirstName() + " " + vacationRequest.getAdministrator().getLastName()));
            document.add(new Paragraph("Start Date: " + vacationRequest.getStartDate()));
            document.add(new Paragraph("End Date: " + vacationRequest.getEndDate()));
            document.add(new Paragraph("Description: " + vacationRequest.getDescription()));
        } catch (DocumentException | IOException e) {
            throw new RuntimeException("Error generating PDF", e);
        } finally {
            document.close();
        }

        return filePath;
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

    public List<VacationRequestDetailsDTO> getVacationRequestsByEmployee() {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        User currentUser = (User) authentication.getPrincipal();
        if(currentUser.getRole() == UserRole.Employee) {
            if(currentUser.getContract() != null) {


                List<VacationRequest> vacationRequests = vacationRequestRepository.findByEmployeeIdOrderByRequestedDateDesc(currentUser.getId());

                return vacationRequests.stream()
                        .map(vacationRequest -> VacationRequestDetailsDTO.builder()
                                .id(vacationRequest.getId())
                                .adminEmail(vacationRequest.getAdministrator().getEmail())
                                .requestedDate(vacationRequest.getRequestedDate())
                                .startDate(vacationRequest.getStartDate())
                                .endDate(vacationRequest.getEndDate())
                                .description(vacationRequest.getDescription())
                                .status(vacationRequest.getStatus())
                                .vacationDays((int)calculateWeekdays(vacationRequest.getStartDate(), vacationRequest.getEndDate()))
                                .build())
                        .collect(Collectors.toList());
            }
            else {
                throw new RuntimeException("Employee has no contract");
            }
        }
        else {
            throw new RuntimeException("User is not an employee");
        }
    }

    public void deleteVacationRequest(Integer requestId) {

        VacationRequest vacationRequest = vacationRequestRepository.findById(requestId).orElse(null);
        if(vacationRequest == null) {
            throw new VacationRequestNotFoundException("Vacation request with id " + requestId + " not found.");
        }
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        User currentUser = (User) authentication.getPrincipal();
        if(currentUser.getRole() == UserRole.Employee) {
            Contract contract = currentUser.getContract();
            if(contract != null) {
                if(vacationRequest.getEmployee().getId() == currentUser.getId()) {
                    contract.setActualYearVacationDays(contract.getActualYearVacationDays() + (int)calculateWeekdays(vacationRequest.getStartDate(), vacationRequest.getEndDate()));
                    contractRepository.save(contract);
                    vacationRequestRepository.deleteById(requestId);
                }
                else {
                    throw new IllegalArgumentException("the vacation request does not belong to the employee who made the request");
                }
            }
            else {
                throw new RuntimeException("Employee has no contract");
            }
        }
        else {
            throw new RuntimeException("User is not an employee");
        }
    }
    public VacationRequest getVacationRequestById(Integer requestId) {
        return vacationRequestRepository.findById(requestId).orElse(null);
    }

}
// sa vad cv la branch daca se schimb