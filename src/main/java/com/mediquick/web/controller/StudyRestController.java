package com.mediquick.web.controller;

import com.mediquick.web.secondary.study.service.StudyService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RequiredArgsConstructor
@RequestMapping("studies")
@RestController
public class StudyRestController {

    private final StudyService studyService;

    @GetMapping({"","/"})
    public ResponseEntity<?> getStudies(){
        return ResponseEntity.ok(studyService.findStudyAll());
    }
}
