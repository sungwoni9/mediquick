package com.mediquick.web.controller;

import com.mediquick.web.primary.finding.domain.Finding;
import com.mediquick.web.primary.finding.service.FindingService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;

@RequiredArgsConstructor
@RequestMapping("report")
@Controller
public class ReportController {

    private final FindingService findingService;

    @GetMapping({"/",""})
    public String report() {
        return "report/reportOpinionForm";
    }

    @GetMapping("detail/{studykey}")
    public String reportDetails() {
        return "report/detail";
    }
}
