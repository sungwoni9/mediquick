package com.mediquick.web.controller;

import com.mediquick.web.secondary.study.service.StudyService;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;

@RequiredArgsConstructor
@RequestMapping
@Controller
public class StudyController {

    private final StudyService studyService;

    @GetMapping("/list/studyList")
    public String list(Model model) {

        String currentUsername = SecurityContextHolder.getContext().getAuthentication().getName();

        model.addAttribute("studies", studyService.findStudyAll());
        return "list/studyList";
    }
}
