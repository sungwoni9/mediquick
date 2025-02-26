package com.mediquick.web.primary.finding.domain;

import com.mediquick.web.util.ResponseDto;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import org.springframework.http.HttpStatus;

@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
public class FindingResponseDto extends ResponseDto {
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

    public FindingResponseDto(Finding finding) {
        this.setStatusCode(HttpStatus.OK.value());
        this.setMessage("판독 소견서가 성공적으로 조회되었습니다.");
        this.code = finding.getCode();
        this.isNormal = finding.isNormal();
        this.lesionLocation = finding.getLesionLocation();
        this.lesionSize = finding.getLesionSize();
        this.lesionCount = finding.getLesionCount();
        this.morphology = finding.getMorphology();
        this.additionalFindings = finding.getAdditionalFindings();
        this.possibleDiagnosis = finding.getPossibleDiagnosis();
        this.clinicalSignificance = finding.getClinicalSignificance();
        this.recommendedStudies = finding.isRecommendedStudies();
        this.comparisonStudies = finding.getComparisonStudies();
        this.additionalComment = finding.getAdditionalComment();
        this.additionalNotes = finding.getAdditionalNotes();
        this.radiologistName = finding.getRadiologistName();
        this.institutionName = finding.getInstitutionName();
        this.urgencyLevel = finding.getUrgencyLevel();
        this.reportStatus = finding.getReportStatus();
    }

}
