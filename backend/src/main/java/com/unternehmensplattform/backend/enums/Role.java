package com.unternehmensplattform.backend.enums;

public enum Role {
    Superadmin(1), Administrator(2), Employee(3);
    private int value;
    private Role(int value) {
        this.value = value;
    }
}
