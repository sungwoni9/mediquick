package com.mediquick.web.primary.interpretation.service;

import com.mediquick.web.primary.interpretation.domain.Interpretation;
import com.mediquick.web.primary.interpretation.domain.InterpretationRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

@RequiredArgsConstructor
@Service
public class InterpretationService {
    private final InterpretationRepository interpretationRepository;

    public boolean createInterpretation(Interpretation interpretation) {
        interpretationRepository.save(interpretation);
        return true;
    }

    public Integer findInterpretationCodeByStudykey(int studykey) {
        Interpretation interpretation = interpretationRepository.findTopByStudykeyOrderByRegDateDesc(studykey);
        return interpretation != null ? interpretation.getCode() : null;
    }

    public Interpretation findByStudykey(int studyKey) {
        return interpretationRepository.findTopByStudykeyOrderByRegDateDesc(studyKey);
    }
}
