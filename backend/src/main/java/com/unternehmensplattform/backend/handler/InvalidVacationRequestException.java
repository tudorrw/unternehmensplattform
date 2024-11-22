package com.unternehmensplattform.backend.handler;

import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.ResponseStatus;

@ResponseStatus(HttpStatus.BAD_REQUEST)
public class InvalidVacationRequestException extends RuntimeException {
    public InvalidVacationRequestException(String message) {
        super(message);
    }
}
