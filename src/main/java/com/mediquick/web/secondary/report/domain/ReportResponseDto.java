package com.mediquick.web.secondary.report.domain;

import com.mediquick.web.util.ResponseDto;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class ReportResponseDto extends ResponseDto {
    private Integer studykey;
    private String readingerid;
    private String readingdate;
    private String studydesc;
    private String modality;

    public ReportResponseDto(Integer studykey, String readingerid, String readingdate, String studydesc, String modality) {
        this.setStatusCode(200);
        this.setMessage("검사기록에 해당하는 소견기록을 가져오는데 성공했습니다.");
        this.studykey = studykey;
        this.readingerid = readingerid;
        this.readingdate = readingdate;
        this.studydesc = studydesc;
        this.modality = modality;
    }

}
