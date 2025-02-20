package com.mediquick.web.primary.userrole.domain;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;

@Getter
@NoArgsConstructor
@AllArgsConstructor
@Entity
@Table(name = "user_role")
public class UserRole {

    @Id
    private String username;
    private Byte roleCode;

    public void update(Byte roleCode) {
        this.roleCode = roleCode;
    }
}
