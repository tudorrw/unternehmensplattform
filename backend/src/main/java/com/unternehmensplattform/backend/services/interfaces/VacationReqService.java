package com.unternehmensplattform.backend.services.interfaces;

import com.unternehmensplattform.backend.enums.VacationReqStatus;


public interface VacationReqService {
    void updateRequestStatus(Integer requestId, VacationReqStatus status);
}
