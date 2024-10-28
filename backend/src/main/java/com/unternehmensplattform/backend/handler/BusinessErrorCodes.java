package com.unternehmensplattform.backend.handler;


import lombok.Getter;
import org.springframework.http.HttpStatus;

import java.net.http.HttpClient;

import static org.springframework.http.HttpStatus.*;

public enum BusinessErrorCodes {
    NO_CODE(0, "No code", NOT_IMPLEMENTED),
    ACCOUNT_LOCKED(302, "Account locked", FORBIDDEN),
    INCORRECT_CURRENT_PASSWORD(300, "current password is incorrect", BAD_REQUEST),
    NEW_PASSWORD_DOES_NOT_MATCH(301, "password does not match", BAD_REQUEST),
    ACCOUNT_DISABLED(303, "User is disabled", FORBIDDEN),
    BAD_CREDENTIALS(302, "Login and / or password is incorrect", FORBIDDEN)
    ;
    @Getter
    private final int code;
    @Getter
    private final String description;
    @Getter
    private final HttpStatus httpStatus;

    BusinessErrorCodes(int code, String description, HttpStatus httpStatus) {
        this.code = code;
        this.description = description;
        this.httpStatus = httpStatus;
    }
}
