package com.mediquick.web.primary.finding.service;

import com.mediquick.web.primary.finding.domain.Finding;
import com.mediquick.web.primary.finding.domain.FindingRepository;
import com.mediquick.web.primary.finding.domain.FindingRequestDto;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

@RequiredArgsConstructor
@Service
public class FindingService {
    private final FindingRepository findingRepository;

    public Finding createFinding(Finding finding) {
        return findingRepository.save(finding);
    }
}