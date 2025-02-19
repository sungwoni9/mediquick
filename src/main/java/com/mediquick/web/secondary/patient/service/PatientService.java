package com.mediquick.web.secondary.patient.service;

import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import com.mediquick.web.secondary.patient.domain.Patient;
import com.mediquick.web.secondary.patient.domain.PatientRepository;

import java.util.List;

@RequiredArgsConstructor
@Service
public class PatientService {

    private final PatientRepository patientRepository;

    public List<Patient> findPatientByPname(String pname) {
        return patientRepository.findByPname(pname);
    }
}
