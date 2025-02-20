package com.mediquick.web.secondary.study.service;

import com.mediquick.web.secondary.study.domain.Study;
import com.mediquick.web.secondary.study.domain.StudyRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;

@RequiredArgsConstructor
@Service
public class StudyService {
    private final StudyRepository studyRepository;

    public List<Study> findStudyAll(){
        return studyRepository.findAll();
    }

    public List<Study> findStudiesByPid(String pid) {
        return studyRepository.findByPid(pid);
    }
}
