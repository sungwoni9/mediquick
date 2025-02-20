package com.mediquick.web.primary.userinfo.domain;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.sql.Timestamp;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class UserInfoRequestDto {
    private String username;
    private String name;
    private String phone;
    private String email;
    private Timestamp deleteTime;
    private String address;
    private String addressDetail;
    private String department;
    private String institutionName;

    public UserInfoRequestDto(String username,String name,String phone,String email,String address,String addressDetail,String department,String institutionName) {
        this.username = username;
        this.name = name;
        this.phone = phone;
        this.email = email;
        this.address = address;
        this.addressDetail = addressDetail;
        this.department = department;
        this.institutionName = institutionName;
    }
}
