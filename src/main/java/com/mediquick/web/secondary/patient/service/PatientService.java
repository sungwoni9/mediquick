package com.mediquick.web.secondary.patient.service;

import com.mediquick.web.primary.medicalrecord.domain.MedicalRecord;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;
import com.mediquick.web.secondary.patient.domain.Patient;
import com.mediquick.web.secondary.patient.domain.PatientRepository;

import java.util.List;

@RequiredArgsConstructor
@Service
public class PatientService {

    private final PatientRepository patientRepository;

    public List<Patient> findPatientsAll(){return patientRepository.findAll(Sort.by(Sort.Direction.ASC,"pid"));}

    public List<Patient> findPatientByPname(String pname) {return patientRepository.findByPname(pname);}

    public List<Patient> findPatientsByPid(List<String> pids) {return patientRepository.findByPidIn(pids);}
}
