package com.mediquick.web.primary.finding.domain;

import com.mediquick.web.util.Timestamp;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;

@NoArgsConstructor
@AllArgsConstructor
@Getter
@Entity
@Table(name = "finding")
public class Finding extends Timestamp {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer code;
    @Column(name = "is_normal")
    private boolean isNormal = true;
    @Column(name = "lesion_location")
    private String lesionLocation;
    @Column(name = "lesion_size")
    private String lesionSize;
    @Column(name = "lesion_count")
    private int lesionCount;
    private String morphology;
    @Column(name = "additional_findings")
    private String additionalFindings;
    @Column(name = "possible_diagnosis")
    private String possibleDiagnosis;
    @Column(name = "clinical_significance")
    private String clinicalSignificance;
    @Column(name = "recommended_studies")
    private boolean recommendedStudies = false;
    @Column(name = "comparison_studies")
    private String comparisonStudies;
    @Column(name = "additional_comment")
    private String additionalComment;
    @Column(name = "additional_notes")
    private String additionalNotes;

    @Column(name = "radiologist_name")
    private String radiologistName;
    @Column(name = "institution_name")
    private String institutionName;
    @Column(name = "urgency_level")
    private int urgencyLevel = 1;
    @Column(name = "report_status")
    private int reportStatus = 1;

    public Finding(FindingRequestDto findingDto) {
        this.isNormal = findingDto.isNormal();
        this.lesionLocation = findingDto.getLesionLocation();
        this.lesionSize = findingDto.getLesionSize();
        this.lesionCount = findingDto.getLesionCount();
        this.morphology = findingDto.getMorphology();
        this.additionalFindings = findingDto.getAdditionalFindings();
        this.possibleDiagnosis = findingDto.getPossibleDiagnosis();
        this.clinicalSignificance = findingDto.getClinicalSignificance();
        this.recommendedStudies = findingDto.isRecommendedStudies();
        this.comparisonStudies = findingDto.getComparisonStudies();
        this.additionalComment = findingDto.getAdditionalComment();
        this.additionalNotes = findingDto.getAdditionalNotes();
        this.radiologistName = findingDto.getRadiologistName();
        this.institutionName = findingDto.getInstitutionName();
        this.urgencyLevel = findingDto.getUrgencyLevel();
        this.reportStatus = findingDto.getReportStatus();
    }

}
