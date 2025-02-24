package com.mediquick.web.primary.user.domain;

import com.mediquick.web.util.ResponseDto;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import org.springframework.http.HttpStatus;

import java.sql.Timestamp;

@Getter
@NoArgsConstructor
public class UserDetailsDto extends ResponseDto {
    // User 필드
    private String username;
    private String password;
    private boolean isDeleted;
    private Timestamp regDate;
    private Timestamp modDate;

    // UserInfo 필드
    private String name;
    private String phone;
    private String email;
    private String address;
    private String addressDetail;
    private String department;
    private String institutionName;
    private Timestamp deleteTime;
    private Timestamp userInfoModDate;

    // UserRole 필드
    private Byte roleCode;

    public UserDetailsDto(String username, String password, boolean isDeleted, java.sql.Timestamp regDate,
                          java.sql.Timestamp modDate, String name, String phone, String email,
                          String address, String addressDetail, String department, String institutionName,
                          java.sql.Timestamp deleteTime, java.sql.Timestamp userInfoModDate, Byte roleCode) {
        this.username = username;
        this.password = password;
        this.isDeleted = isDeleted;
        this.regDate = regDate;
        this.modDate = modDate;
        this.name = name;
        this.phone = phone;
        this.email = email;
        this.address = address;
        this.addressDetail = addressDetail;
        this.department = department;
        this.institutionName = institutionName;
        this.deleteTime = deleteTime;
        this.userInfoModDate = userInfoModDate;
        this.roleCode = roleCode;
        super.setStatusCode(HttpStatus.OK.value());
        super.setMessage("회원 정보 조회 완료.");
    }
}
