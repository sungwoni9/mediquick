package com.mediquick.web.primary.finding.domain;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Setter
@Getter
@NoArgsConstructor
@AllArgsConstructor
public class FindingRequestDto {
    private Integer code;
    private boolean isNormal;
    private String lesionLocation;
    private String lesionSize;
    private int lesionCount;
    private String morphology;
    private String additionalFindings;
    private String possibleDiagnosis;
    private String clinicalSignificance;
    private boolean recommendedStudies;
    private String comparisonStudies;
    private String additionalComment;
    private String additionalNotes;
    private String radiologistName;
    private String institutionName;
    private int urgencyLevel;
    private int reportStatus;
}