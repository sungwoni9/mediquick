package com.mediquick.web.primary.userrole.domain;

import com.mediquick.web.primary.role.domain.Role;
import com.mediquick.web.primary.user.domain.User;
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
