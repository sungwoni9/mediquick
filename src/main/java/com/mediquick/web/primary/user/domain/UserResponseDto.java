package com.mediquick.web.primary.user.domain;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.sql.Timestamp;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class UserResponseDto {
    private String username;
    private String password;
    private Boolean is_deleted;
    private Timestamp regDate;
    private Timestamp modDate;
}
