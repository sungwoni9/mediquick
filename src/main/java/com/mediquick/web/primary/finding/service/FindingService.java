package com.mediquick.web.primary.finding.service;

import com.mediquick.web.primary.finding.domain.Finding;
import com.mediquick.web.primary.finding.domain.FindingRepository;
import com.mediquick.web.primary.finding.domain.FindingRequestDto;
import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.Optional;

@RequiredArgsConstructor
@Service
public class FindingService {
    private final FindingRepository findingRepository;

    public Finding createFinding(Finding finding) {
        return findingRepository.save(finding);
    }

    @Transactional
    public boolean updateFinding(FindingRequestDto findingDto) {
        int code = findingDto.getCode();
        Optional<Finding> target = findingRepository.findById(code);
        Finding finding = target.orElse(null);

        if(finding == null) return false;

        finding.update(findingDto);
        return true;
    }

    public Finding findFindingByCode(int code) {
        Optional<Finding> Finding = findingRepository.findById(code);
        return Finding.orElse(null);
    }

}