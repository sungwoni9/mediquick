package com.mediquick.web.primary.medicalrecord.service;


import com.mediquick.web.primary.medicalrecord.domain.MedicalRecord;
import com.mediquick.web.primary.medicalrecord.domain.MedicalRecordRepository;
import com.mediquick.web.secondary.patient.domain.Patient;
import com.mediquick.web.secondary.patient.service.PatientService;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class  MedicalRecordService {
    private final MedicalRecordRepository medicalRecordRepository;
    private final PatientService patientService;

    public MedicalRecord save(MedicalRecord medicalRecord) {
        return medicalRecordRepository.save(medicalRecord);
    }

    public List<MedicalRecord> findByPid(String pid) {
        return medicalRecordRepository.findByPid(pid);
    }

    public MedicalRecord findByCode(Integer code) {return medicalRecordRepository.findById(code).orElse(null);}

    public List<MedicalRecord> findMedicalAll() {
        List<MedicalRecord> records = medicalRecordRepository.findAll(Sort.by(Sort.Direction.ASC, "code"));

        List<String> pids = records.stream()
                .map(MedicalRecord::getPid)
                .distinct()
                .collect(Collectors.toList());

        List<Patient> patients = patientService.findPatientsByPid(pids);
        Map<String, String> pidToPnameMap = patients.stream()
                .collect(Collectors.toMap(
                        Patient::getPid,
                        Patient::getPname,
                        (existing, replacement) -> existing
                ));

        for (MedicalRecord record : records) {
            record.setPname(pidToPnameMap.getOrDefault(record.getPid(), "Unknown"));
        }

        return records;
    }}
