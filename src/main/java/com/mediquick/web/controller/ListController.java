package com.mediquick.web.controller;

import com.mediquick.web.primary.medicalrecord.service.MedicalRecordService;
import com.mediquick.web.secondary.patient.domain.Patient;
import com.mediquick.web.secondary.patient.service.PatientService;
import com.mediquick.web.secondary.study.service.StudyService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;

import java.util.List;

@RequiredArgsConstructor
@Controller
@RequestMapping("/list")
public class ListController {

    private final StudyService studyService;
    private final PatientService patientService;
    private final MedicalRecordService medicalRecordService;

    @GetMapping("/studyList")
    public String studyList(Model model) {
        model.addAttribute("studies", studyService.findStudyAll());
        return "list/studyList";
    }

    @GetMapping("/patientList")
    public String patientList(Model model) {
        model.addAttribute("patient", patientService.findPatientsAll());
        return "list/patientList";
    }

    @GetMapping("/medicalList")
    public String medicalList(Model model) {
        model.addAttribute("medical", medicalRecordService.findMedicalAll());
        return "list/medicalList";
    }
}