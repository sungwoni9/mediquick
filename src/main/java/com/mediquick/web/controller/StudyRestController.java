package com.mediquick.web.controller;

import com.mediquick.web.secondary.study.domain.Study;
import com.mediquick.web.secondary.study.service.StudyService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RequiredArgsConstructor
@RequestMapping("studies")
@RestController
public class StudyRestController {

    private final StudyService studyService;

    @GetMapping({"","/"})
    public ResponseEntity<?> getStudies(){
        return ResponseEntity.ok(studyService.findStudyAll());
    }

    @GetMapping("/{studykey}")
    public ResponseEntity<Study> getStudyByStudyKey(@PathVariable("studykey") int studyKey){

        Study study = studyService.findStudyByStudykey(studyKey);

        if(study == null)
            return ResponseEntity.notFound().build();

        return ResponseEntity.ok(study);
    }

    @GetMapping("/patient/{pid}")
    public ResponseEntity<List<Study>> getStudiesByPatient(@PathVariable("pid") String pid) {
        List<Study> studies = studyService.findStudiesByPid(pid);

        if (studies.isEmpty()) {
            return ResponseEntity.noContent().build();
        }

        return ResponseEntity.ok(studies);
    }
}
