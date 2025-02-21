package com.mediquick.web.controller;

import com.mediquick.web.secondary.study.service.StudyService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;

@RequiredArgsConstructor
@RequestMapping("/study")
@Controller
public class StudyController {

    private final StudyService studyService;

    @GetMapping("/list")
    public String list(Model model) {
        model.addAttribute("studies", studyService.findStudyAll());
        return "study_list/studyList";
    }
}
