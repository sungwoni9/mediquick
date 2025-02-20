package com.mediquick.web.primary.medicalrecord.service;


import com.mediquick.web.primary.medicalrecord.domain.MedicalRecord;
import com.mediquick.web.primary.medicalrecord.domain.MedicalRecordRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class MedicalRecordService {
    private final MedicalRecordRepository medicalRecordRepository;

    public MedicalRecord save(MedicalRecord medicalRecord) {
        return medicalRecordRepository.save(medicalRecord);
    }

    public List<MedicalRecord> findByPid(String pid) {
        return medicalRecordRepository.findByPid(pid);
    }

    public MedicalRecord findByCode(Integer code) {
        return medicalRecordRepository.findById(code).orElse(null);
    }

    public void deleteByCode(Integer code) {
        medicalRecordRepository.deleteById(code);
    }
}
