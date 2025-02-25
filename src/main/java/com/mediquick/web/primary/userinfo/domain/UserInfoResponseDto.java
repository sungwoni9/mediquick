package com.mediquick.web.primary.userinfo.domain;

import com.mediquick.web.util.ResponseDto;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import org.springframework.http.HttpStatus;

import java.sql.Timestamp;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class UserInfoResponseDto extends ResponseDto {
    private String username;
    private String name;
    private String phone;
    private String email;
    private Timestamp deleteTime;
    private String address;
    private String addressDetail;
    private String department;
    private String institutionName;
    private Timestamp modDate;

    public UserInfoResponseDto(UserInfo userInfo) {
        super.setStatusCode(HttpStatus.OK.value());
        super.setMessage("회원 정보 조회 완료.");
        this.username = userInfo.getUsername();
        this.name = userInfo.getName();
        this.phone = userInfo.getPhone();
        this.email = userInfo.getEmail();
        this.deleteTime = userInfo.getDeleteTime();
        this.address = userInfo.getAddress();
        this.addressDetail = userInfo.getAddressDetail();
        this.department = userInfo.getDepartment();
        this.institutionName = userInfo.getInstitutionName();
        this.modDate = userInfo.getModDate();
    }
}
