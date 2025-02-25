package com.mediquick.web.primary.user.domain;

import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Setter
@Getter
@NoArgsConstructor
public class UserRegisterDto {
    private String username;
    private String password;
    private String name;
    private String phone;
    private String email;
    private String address;
    private String addressDetail;
    private String department;
    private String institutionName;
    private Byte roleCode;
}