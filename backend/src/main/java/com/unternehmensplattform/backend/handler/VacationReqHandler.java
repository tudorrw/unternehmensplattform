package com.unternehmensplattform.backend.handler;
import org.springframework.stereotype.Component;

import java.time.DayOfWeek;
import java.time.LocalDate;

@Component
public class VacationReqHandler {

    public Integer calculateWorkingDays(LocalDate startDate, LocalDate endDate) {
        int weekendDays = calculateWeekendDays(startDate, endDate);
        return endDate.getDayOfYear() - startDate.getDayOfYear() - weekendDays + 1;
    }

    private Integer calculateWeekendDays(LocalDate startDate, LocalDate endDate) {
        int count = 0;
        for (LocalDate date = startDate; !date.isAfter(endDate); date = date.plusDays(1)) {
            if (date.getDayOfWeek() == DayOfWeek.SATURDAY || date.getDayOfWeek() == DayOfWeek.SUNDAY) {
                count++;
            }
        }
        return count;
    }

    public Integer calculateLeaveDays(LocalDate startDate, LocalDate endDate) {
        return calculateWorkingDays(startDate, endDate);
    }
}