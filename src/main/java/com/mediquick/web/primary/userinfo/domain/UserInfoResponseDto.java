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
public class UserInfoResponseDto {
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
}
