package com.mediquick.web.controller;

import com.mediquick.web.secondary.study.domain.Study;
import com.mediquick.web.secondary.study.service.StudyService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import com.mediquick.web.secondary.patient.domain.Patient;
import com.mediquick.web.secondary.patient.service.PatientService;

import java.util.ArrayList;
import java.util.List;

@RequiredArgsConstructor
@RequestMapping("patient")
@RestController
public class PatientRestController {
    private final PatientService patientService;
    private final StudyService studyService;

    @GetMapping({"","/"})
    public ResponseEntity<?> getPatients() {return ResponseEntity.ok(patientService.findPatientsAll());}

    @GetMapping("/search")
    public ResponseEntity<Object> search(@RequestParam String pname) {
        // 1. 환자 정보 조회
        List<Patient> patientsList = patientService.findPatientByPname(pname);

        if (patientsList.isEmpty()) {
            return ResponseEntity
                    .status(HttpStatus.NOT_FOUND)
                    .body("존재하지 않는 환자입니다.");
        }

        // 2. 환자 검사 조회
        List<PatientWithStudies> result = new ArrayList<>();
        for (Patient patient : patientsList) {
            List<Study> studies = studyService.findStudiesByPid(patient.getPid());
            result.add(new PatientWithStudies(patient, studies));
        }
        return ResponseEntity.ok(result);
    }

    class PatientWithStudies {
        private Patient patient;
        private List<Study> studies;

        public PatientWithStudies(Patient patient, List<Study> studies) {
            this.patient = patient;
            this.studies = studies;
        }

        public Patient getPatients() {
            return patient;
        }

        public List<Study> getStudies() {
            return studies;
        }
    }
}


