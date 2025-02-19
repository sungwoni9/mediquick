package com.mediquick.web.controller;

import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import com.mediquick.web.secondary.patient.domain.Patient;
import com.mediquick.web.secondary.patient.service.PatientService;
import org.springframework.web.server.ResponseStatusException;

import java.util.List;

@RequiredArgsConstructor
@RequestMapping("/patients")
@RestController
public class PatientRestController {
    private final PatientService patientService;

    @GetMapping("/search")
    public ResponseEntity<Object> search(@RequestParam String pname) {
        List<Patient> patientsList = patientService.findPatientByPname(pname);

        if (patientsList.isEmpty()) {
            return ResponseEntity
                    .status(HttpStatus.NOT_FOUND)
                    .body("존재하지 않는 환자입니다.");
        }

        return ResponseEntity.ok(patientsList);
    }
}

