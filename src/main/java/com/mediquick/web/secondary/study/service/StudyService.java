package com.mediquick.web.secondary.study.service;

import com.mediquick.web.primary.finding.domain.Finding;
import com.mediquick.web.primary.finding.service.FindingService;
import com.mediquick.web.primary.interpretation.domain.Interpretation;
import com.mediquick.web.primary.interpretation.service.InterpretationService;
import com.mediquick.web.secondary.study.domain.Study;
import com.mediquick.web.secondary.study.domain.StudyRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;

import java.util.List;

@RequiredArgsConstructor
@Service
public class StudyService {
    private final StudyRepository studyRepository;
    private final InterpretationService interpretationService;
    private final FindingService findingService;

    public List<Study> findStudyAll(){return studyRepository.findAll(Sort.by(Sort.Direction.ASC,"studykey"));}

    public List<Study> findStudiesByPid(String pid) {return studyRepository.findByPid(pid);}

    public Study findStudyByStudykey(int studykey) {return studyRepository.findStudyByStudykey(studykey);}

    public int getUrgencyLevel(int studykey) {
        Interpretation interpretation = interpretationService.findByStudykey(studykey);
        if (interpretation != null) {
            Finding finding = findingService.findFindingByCode(interpretation.getCode());
            if (finding != null) {
                return finding.getUrgencyLevel();
            }
        }
        return 0; // 기본값 (none)
    }
}
