package com.unternehmensplattform.backend.handler;

import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.ResponseStatus;

@ResponseStatus(HttpStatus.CONFLICT)
public class VacationRequestOverlapException extends RuntimeException {
    public VacationRequestOverlapException(String message) {
        super(message);
    }
}
