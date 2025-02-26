package com.mediquick.web.secondary.patient.domain;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface PatientRepository extends JpaRepository<Patient, String> {
    @Query("SELECT s.pid FROM Patient s")

    List<Patient> findByPname(String pname);
}
