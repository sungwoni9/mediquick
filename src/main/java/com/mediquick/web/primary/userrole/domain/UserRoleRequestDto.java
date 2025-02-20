package com.mediquick.web.primary.userrole.domain;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class UserRoleRequestDto {
    private String username;
    private Byte roleCode;
}
