package com.mediquick.web.secondary.patient.domain;

import com.mediquick.web.primary.medicalrecord.domain.MedicalRecord;
import org.springframework.data.domain.Sort;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface PatientRepository extends JpaRepository<Patient, String> {

    List<Patient> findAll(Sort sort);

    List<Patient> findByPname(String pname);

    List<Patient> findByPidIn(List<String> pids);}
