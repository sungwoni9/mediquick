package com.mediquick.web.secondary.patient.domain;

import lombok.*;

import java.io.Serializable;

@AllArgsConstructor
@Getter
@Setter
@NoArgsConstructor
@EqualsAndHashCode
public class PatientId implements Serializable {
    private String pid;
}
