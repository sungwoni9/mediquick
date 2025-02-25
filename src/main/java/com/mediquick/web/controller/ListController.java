package com.mediquick.web.controller;

import com.mediquick.web.secondary.study.service.StudyService;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;

@RequiredArgsConstructor
@Controller
@RequestMapping("/list")
public class ListController {

    private final StudyService studyService;

    @GetMapping("/studyList")
    public String list(Model model) {
        String currentUsername = SecurityContextHolder.getContext().getAuthentication().getName();
        model.addAttribute("studies", studyService.findStudyAll());
        return "list/studyList";
    }

    @GetMapping("/patientList")
    public String patientList() {
        return "list/patientList";
    }

    @GetMapping("/medicalList")
    public String medicalList() {
        return "list/medicalList";
    }
}