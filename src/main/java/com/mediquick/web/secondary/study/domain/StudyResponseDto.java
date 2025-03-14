package com.mediquick.web.secondary.study.domain;

import com.mediquick.web.util.ResponseDto;
import lombok.Getter;
import lombok.Setter;

@Setter
@Getter
public class StudyResponseDto extends ResponseDto {
    private Integer studykey;
    private String pid;
    private String pname;
    private String psex;
    private String pbirthdatetime;

    public StudyResponseDto(Integer studykey, String pid, String pname, String psex, String pbirthdatetime) {
        this.setStatusCode(200);
        this.setMessage("검사기록에 해당하는 환자정보를 가져오는데 성공했습니다.");
        this.studykey = studykey;
        this.pid = pid;
        this.pname = pname;
        this.psex = psex;
        this.pbirthdatetime = pbirthdatetime;
    }
}
