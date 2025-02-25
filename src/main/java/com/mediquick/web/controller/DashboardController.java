package com.mediquick.web.controller;

import com.mediquick.web.secondary.study.service.StudyService;
import com.mediquick.web.primary.medicalrecord.service.MedicalRecordService; // 필요 시
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;

@RequiredArgsConstructor
@RequestMapping
@Controller
public class DashboardController {
    private final StudyService studyService;
    private final MedicalRecordService medicalRecordService;

    @GetMapping("/dashboard")
    public String dashboard(Model model) {

        model.addAttribute("studies", studyService.findStudyAll());
        return "/list/dashboard";
    }
}