package com.mediquick.web.secondary.patient.domain;

import jakarta.persistence.*;
import lombok.Getter;

@Getter
@Entity
@Table(name = "patienttab", schema = "pacsplus")
@IdClass(PatientId.class)
public class Patient {

    @Id
    private String pid;
    private String pname;
    private String psex;
    private String pbirthdate;
}
