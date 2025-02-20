package com.mediquick.web.primary.finding.domain;

import com.mediquick.web.util.Timestamp;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;

@Getter
@NoArgsConstructor
@AllArgsConstructor
@Entity
@Table(name = "finding")
public class Finding extends Timestamp {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private long code;
    private boolean isNormal = true;
    private String lesionLocation;
    private String lesionSize;
    private int lesionCount;
    private String morphology;
    private String additionalFindings;
    private String possibleDiagnosis;
    private String clinicalSignificance;
    private boolean recommendedStudies = false;
    private String comparisonStudies;
    private String additionalComment;
    private String additionalNotes;
    private String radiologistName;
    private int urgencyLevel = 1;
    private int reportStatus = 1;

}
