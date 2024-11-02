package com.unternehmensplattform.backend.services.implementations;

import com.unternehmensplattform.backend.repositories.WorkingDaysRepository;
import com.unternehmensplattform.backend.services.interfaces.WorkingDaysService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class WorkingDaysServiceImpl implements WorkingDaysService {
    private final WorkingDaysRepository workingDaysRepository;
}
