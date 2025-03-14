package com.mediquick.web.primary.role.domain;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.NoArgsConstructor;

@Entity(name = "role")
@Getter
@NoArgsConstructor
public class Role {
    @Id
    @Column(columnDefinition = "TINYINT")
    private Byte code;

    @Column(name = "role_name", length = 50, nullable = false)
    private String roleName;
}
