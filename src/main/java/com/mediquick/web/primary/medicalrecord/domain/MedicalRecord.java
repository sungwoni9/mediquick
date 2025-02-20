package com.mediquick.web.primary.medicalrecord.domain;

import com.mediquick.web.util.Timestamp;
import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
@Entity
@Table(name = "medical_records")
public class MedicalRecord extends Timestamp {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer code;

    @Column(nullable = false, length = 20)
    private String username;

    @Column(nullable = false, length = 64)
    private String pid;

    @Column(length = 255)
    private String patientSymptoms;

    @Column(length = 255)
    private String orderDesc;

    @Column(nullable = false)
    private java.sql.Timestamp medicalDate;
}