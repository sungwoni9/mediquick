package com.mediquick.web.primary.medicalrecord.domain;

import org.springframework.data.domain.Sort;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface MedicalRecordRepository extends JpaRepository<MedicalRecord, Integer> {
    List<MedicalRecord> findByPid(String pid);

    List<MedicalRecord> findAll(Sort sort);
}
