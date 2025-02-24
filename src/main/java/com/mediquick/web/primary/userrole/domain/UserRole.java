package com.mediquick.web.primary.userrole.domain;

import com.mediquick.web.primary.role.domain.Role;
import com.mediquick.web.primary.user.domain.User;
import jakarta.persistence.*;
import lombok.Getter;
import lombok.NoArgsConstructor;

@Entity(name = "user_role")
@Getter
@NoArgsConstructor
public class UserRole {
    @Id
    @Column(length = 20)
    private String username;

    @OneToOne
    @JoinColumn(name = "username", insertable = false, updatable = false)
    private User user;

    @Column(name = "role_code", columnDefinition = "TINYINT DEFAULT 2")
    private Byte roleCode = 2;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "role_code", insertable = false, updatable = false)
    private Role role;

    public UserRole(String username, Byte roleCode) {
        this.username = username;
        this.roleCode = roleCode;
    }

    public void update(Byte roleCode) {
        this.roleCode = roleCode;
    }
}
