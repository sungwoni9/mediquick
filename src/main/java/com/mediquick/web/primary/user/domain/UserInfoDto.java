package com.mediquick.web.primary.user.domain;

import com.mediquick.web.util.ResponseDto;
import lombok.Getter;
import lombok.NoArgsConstructor;
import org.springframework.http.HttpStatus;

@Getter
@NoArgsConstructor
public class UserInfoDto extends ResponseDto {
    // UserInfo 필드
    private String name;
    private String department;
    private String institutionName;

    // UserRole 필드
    private Byte roleCode;

    public UserInfoDto(String name, String department, String institutionName, Byte roleCode) {
        this.name = name;
        this.department = department;
        this.institutionName = institutionName;
        this.roleCode = roleCode;
        super.setStatusCode(HttpStatus.OK.value());
        super.setMessage("회원 정보 조회 완료.");
    }
}
